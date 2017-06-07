// Initialize Firebase

// need to work on the submit button , once the submit clicks it will switch turns to (2) , if it was on (2) it will call the endgame function

var config = {
  apiKey: "AIzaSyB8PdcFQ8isaUyr33dV3cvGydDhMfI9mM0",
  authDomain: "where-are-we-84538.firebaseapp.com",
  databaseURL: "https://where-are-we-84538.firebaseio.com",
  projectId: "where-are-we-84538",
  storageBucket: "where-are-we-84538.appspot.com",
  messagingSenderId: "414783702161"
};
firebase.initializeApp(config);

//set database object and neccessary groups
var database = firebase.database();
var playersRef = database.ref("/players");


//variabes for store each players object
var player1 = null;
var player2 = null;
var turn=0;
var gameInitialized=true;
var playerName = "";
var thisPlayer;
var roundEnd=true;

//Array of city objects. When we actually fill out all the city info we can move the array to another JS file to reduce clutter


var randomCity;

//these are variables for setting up guess map and getting target destination photos
var map;
var infoWindow;
var service;
var referenceArray = [];
var time = 100;
var guessedLat,guessedLng,cityLocation;

//player enter event
$("#addPlayer").click(function () {
  event.preventDefault();
  if ($("#name-input").val() !== ""){
    playerName = $("#name-input").val().trim();;
    enterGame();
  }
});

$("#name-input").keypress(function(e) {
  if (e.keycode === 13 && $("#name-input").val() !== "") {
    playerName = $("#name-input").val().trim();
    enterGame();
  }
});

$("body").on("click","button", function(){


  if(turn ===1 && player1.name === thisPlayer)
  {
    storeGuessCoor_Diff("1");
    database.ref().child("/turn").set(2);

  }else
  {
    //still player1's turn but the value is submmitted from player2's window
   
  }

  if(turn ===2 && player2.name === thisPlayer)
  {
     storeGuessCoor_Diff("2");
        //When both players diffDistance values are in, call result function
      endGame();
  }
  else
  {
    //player2's turn, but value is submitted from player1's window.
  }

});

function storeGuessCoor_Diff(childPath)
{
  //store guessed coordinates for player1
  playersRef.child(childPath+"/guessedLat").set(guessedLat);
  playersRef.child(childPath+"/guessedLng").set(guessedLng);


    //Create new LatLng object for players location, pulling lat and lng from firebase
  var guessedLocation = new google.maps.LatLng(guessedLat, guessedLng);
    //myLatLng=guessedLocation;
    //Testing the distance calculation. We would change this to reference the specific location in an array of locations
  var diffDist = google.maps.geometry.spherical.computeDistanceBetween(cityLocation, guessedLocation);

  //store difference distance for player1
  playersRef.child(childPath+"/diffDistance").set(diffDist);
};


function enterGame() {

  //check if both player exists
  if (!(player1 && player2)) {
    //if there is no player one
    if (player1 === null) {
      //initialize player1 object
      player1 = {
        name: playerName,
        win: 0,
        loss: 0,
        tie: 0,
        guessedLat: 0,
        guessedLng: 0,
        diffDistance: 0
      };
      playersRef.child(1).set(player1);
      // chatkey=chatRef.push().key;
      // chatRef.child(chatkey).set({name:playerName});
      thisPlayer = playerName; //store the player to the player's screen
      //set the turn indicator to 1
      database.ref().child("/turn").set(1);
      // database.ref("/result").child("/round").set(0);
      randomCity = cities[Math.floor(Math.random() * cities.length)];
      database.ref().child("/targetCity").set(randomCity);

      database.ref("/players/1").onDisconnect().remove();
      //$("#name-form").html("<div class= 'jumbotron' id='plm'>" + "<h3>" + "Waiting on Player 2 to join!" + "</h3>" + "</div>");
      $("#instructions").html("<div class= 'jumbotron' id='plm'>" + "<h3>" + "Waiting on Player 2 to join!" + "</h3>" + "</div>");

    }//if there is no player one
    else if (player2 === null) {
      //initialize player1 object
      player2 = {
        name: playerName,
        win: 0,
        loss: 0,
        tie: 0,
        guessedLat: 0,
        guessedLng: 0,
        diffDistance: 0
      };
      playersRef.child(2).set(player2);
      // database.ref("/result").child("/round").set(0);
      // chatkey=chatRef.push().key;
      // chatRef.child(chatkey).set({name:playerName});
      thisPlayer = playerName;
      database.ref("/players/2").onDisconnect().remove();
    }
  }
};

database.ref("/photoReference").on("value", function(snap){
  if(snap.exists())
  {
    referenceArray=snap.val();
    displayPlacePhotos();
  }else
  {
    referenceArray=[];
  }

});

//this is monitoring the value add in players group in the database
playersRef.on("value", function (snapshot) {
  if (snapshot.child("1").exists()) {
    //player1 exist
    player1 = snapshot.child("1").val();

  } else {
    player1 = null;
  }

  if (snapshot.child("2").exists()) {
    //player2 exist
    player2 = snapshot.child("2").val();


  } else {
    player2 = null;
  }

  //when both players are present, set up the game play screen
  if(player1 && player2)
  {


    $("#timer").show();
    setInterval(function(){
      time--;
      $("#timer").text(time);
      if(time === 0){
        //need function here to hide game screen and show results screen
      }
    }, 1000);

    //create game play screen
    gamePlay();

  }




});

playersRef.on("child_removed", function (snapshot) {
  $("#gamePlay").empty();
  gameInitialized=true;
  roundEnd=true;
  database.ref("/photoReference").remove();
  referenceArray=[];
  turn=0;
  database.ref().child("/turn").remove();
  database.ref().child("targetCity").remove();
  database.ref().child("result").remove();

});

database.ref().child("/turn").on("value",function(snap){
  turn=snap.val();

});

database.ref().child("/targetCity").on("value",function(snap){
  randomCity=snap.val();
});

database.ref().child("/result").on("value",function(snap){

  if(snap.exists())
  {
    $("#gamePlay").html(snap.val());
  }

});

  function gamePlay()
  {
    if(gameInitialized)
    {//define the structure to store players' guess map
      // var playernames=$("<div>");
      // playernames.addClass("row");
      // var playername1=$("<div>");
      // playername1.addClass("col-md-6");
      // playername1.attr("id","name1");
      // playername1.append(player1.name);
      // var playername2=$("<div>");
      // playername2.addClass("col-md-6"); 
      // playername2.attr("id","name2");
      // playername2.append(player2.name);
      // playernames.append(playername1);
      // playernames.append(playername2);  
      // $("#gamePlay").append(playernames);

      var guessMaps=$("<div>");
      guessMaps.addClass("row");
      var guessMap1=$("<div>");
      guessMap1.addClass("col-md-12")
      //var guessMap2=$("<div>");
      ///guessMap2.addClass("col-md-6");
      guessMap1.attr("id","map");
      //guessMap2.attr("id","map2");
      guessMaps.append(guessMap1);
      //guessMaps.append(guessMap2);
      var button=$("<button>");
      button.attr("type","button");
      button.text("submit Answer");
      $("#gamePlay").append(guessMaps);
      $("#gamePlay").append(button);
      $("#instructions").html("<div class='jumbotron' text-align='center'>" + "<h2>" + "Instructions" + "</h2>" + "<ol>" + "<li>" + "Player 1 goes first, drag your pin on the map and drop it on the location where you think these pictures are!"  + "</li>" + "<li>" + "Then press submit!" + "</li>" + "<li>" + "Player 2 must make their submission after Player 1, follow the same steps above!" +"</li>" + "</ol>" + "</div>");
      $("#plm").hide();

      //call google map api
      initMap();
    }

  }

//MAP AND IMAGE FUNCTIONS
//==========================================================
//Declare the location of the default map pin
  var myLatLng = { lat: 0, lng: 0 };
//This is the function for adding the pin-drop map
function initMap() {
  
  //Create new LatLng object for the location of "randomCity"
 cityLocation = new google.maps.LatLng(randomCity.lat, randomCity.lng);

  //Compiling a new map object for guessing 
  //this is for player 1's guess map
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: myLatLng,
    streetViewControl: false
  });

  //Creating the marker and making it draggable for player to drag
  //player1's draggable marker 
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    draggable: true,
    title: "Drag me!"
  });

  // //create player2's guess map
  // var map2 = new google.maps.Map(document.getElementById('map2'), {
  //   zoom: 1,
  //   center: myLatLng,
  //   streetViewControl: false
  // });

  // //Creating the marker and making it draggable for player to drag
  // //player2's draggable marker 
  // var marker2 = new google.maps.Marker({
  //   position: myLatLng,
  //   map: map2,
  //   draggable: true,
  //   title: "Drag me!"
  // });

  //Use a listening event to retrieve the end value of where the marker is dragged to
  //player1's marker listener for user's drag event
  google.maps.event.addListener(marker, 'dragend', function () {
    guessedLat = marker.getPosition().lat();
    guessedLng = marker.getPosition().lng();

    console.log(guessedLat);
    console.log(guessedLng);

    //Asssign the lat and lng values of the new marker location to #lat and #lng in the hidden form
    $('#lat').val(guessedLat);
    $('#lng').val(guessedLng);


    //closing drag end event listener
  });


  // //Use a listening event to retrieve the end value of where the marker is dragged to
  // //player2's marker listener for user's drag event
  // google.maps.event.addListener(marker2, 'dragend', function () {
  //   var guessedLat = marker2.getPosition().lat();
  //   var guessedLng = marker2.getPosition().lng();

  //   console.log(guessedLat);
  //   console.log(guessedLng);

  //   //Asssign the lat and lng values of the new marker location to #lat and #lng in the hidden form
  //   $('#lat').val(guessedLat);
  //   $('#lng').val(guessedLng);

  //   //store guessed coordinates for player1
  //   playersRef.child("2/guessedLat").set(guessedLat);
  //   playersRef.child("2/guessedLng").set(guessedLng);


  //   //Create new LatLng object for players location, pulling lat and lng from firebase
  //   var guessedLocation = new google.maps.LatLng(player2.guessedLat, player2.guessedLng);
  //   myLatLng=guessedLocation;
  //   //Testing the distance calculation. We would change this to reference the specific location in an array of locations
  //   var diffDist = google.maps.geometry.spherical.computeDistanceBetween(cityLocation, guessedLocation);

  //   //store difference distance for player1
  //   playersRef.child("2/diffDistance").set(diffDist);

  //   //closing drag end event listener
  // });

  if(gameInitialized)
  {//Establishing search request to Google Maps Places Library
    var request = {
      location: cityLocation,
      radius: 5000,
      keyword: randomCity.name,
    };

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    //Function for running search and assigning what's returned to a callback function
    
    service.nearbySearch(request, callback);
    gameInitialized=false;
  }

  //Closing initMap();
}
//======================================================

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }

  if (referenceArray.length < 1)
  {//retreive photos that represent the target destination
    for (var i = 0, result; result = results[i]; i++) {
      if (typeof result.photos !== 'undefined') {
        var cityPhoto = result.photos[0].getUrl({ 'maxWidth': 1140});
        referenceArray.push(cityPhoto);
      }
    }
    //store photoRefernce array into firebase
  database.ref("/photoReference").set(referenceArray);
  }

  


}
//function for display target destination photos in a carousel style
function displayPlacePhotos()
  {
    //tmp array for testing purpose
    // var photoRefIds=["https://lh6.googleusercontent.com/-IoCBf7ZHrCs/V4dZSvupvzI/AAAAAAAA0mQ/YxzSoz0FiKg-kUdmimLSPk3sG-Bs0f5qACJkC/w400-h400-k/","https://lh3.googleusercontent.com/-C4-0ZpPCcLM/WE74Ae8DFYI/AAAAAAAB1Jw/8qF8gy2h5ioaMtnJxMZs61yRMJ_HLW81ACLIB/w400-h400-k/"];

    //this is setting up the phot carousel structure
    var carouselId="photoCarousel";
    var carouselRow=$("<div>");
    carouselRow.addClass("row");
    var carouselCol=$("<div>");
    carouselCol.addClass("col-md-12");
    var carouselContent=$("<div>");
    carouselContent.addClass("carousel slide");
    carouselContent.attr("id",carouselId);
    carouselContent.attr("data-ride","carousel");
    var carIndicators=$("<ol>");
    carIndicators.addClass("carousel-indicators");
    var carInner=$("<div>");
    carInner.addClass("carousel-inner");
    carInner.attr("role","listbox");

    for(var i =0; i< referenceArray.length;i++)
    {
      //list tags for carousel indicators section
      var carList=$("<li>");
      carList.attr("data-target",carouselId);
      carList.attr("data-slide-to",i);

      //add items to carousel inner section
      var carItem=$("<div>");
      
      var imgItem=$("<img>");
      imgItem.attr("src",referenceArray[i]);
     
      if(i===0)
      {
        carList.addClass("active");
        carItem.addClass("item active");
      }
      else
      {
        carList.addClass("");
        carItem.addClass("item");
      }
      carIndicators.append(carList);

      carItem.append(imgItem);
      carInner.append(carItem);
    }

    carouselContent.append(carIndicators);
    carouselContent.append(carInner);
    carouselCol.append(carouselContent);
    //adding left and right arrow
    carouselContent.append("<a class=\"left carousel-control\" href=\"#photoCarousel\" role=\"button\" data-slide=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span><span class=\"sr-only\">Previous</span></a><a class=\"right carousel-control\" href=\"#photoCarousel\" role=\"button\" data-slide=\"next\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span><span class=\"sr-only\">Next</span></a>")
    carouselRow.append(carouselCol);

    //display the carousel to the gamePlay area
    $("#gamePlay").prepend(carouselRow);
// var photoDisp=displayPlacePhotos();
  // $("#gameplay").append(photoDisp);
}




// Result function comparing distance of player1&2 , and displaying the result havent done the restart game button yet 
function endGame() {

  if (player1.diffDistance > player2.diffDistance) // player2 wins then
  {
    
    player1.loss++;
    playersRef.child("/1/loss").set(player1.loss);
    player2.win++;
    playersRef.child("/2/win").set(player2.win);
    
  }
  else if (player1.diffDistance < player2.diffDistance) //if player1 wins then 
  {
    
    player2.loss++;
    playersRef.child("/2/loss").set(player2.loss);
    player1.win++;
    playersRef.child("/1/win").set(player1.win);
  

  }
  else  // incase of a tie
  {
    //alert("this never happens");
    
    player2.tie++;
    playersRef.child("/2/tie").set(player2.tie);
    player1.tie++;
    playersRef.child("/1/tie").set(player1.tie);

  }
  database.ref().child("/turn").set(1);    
  resultScreen()

}

function resultScreen()
{
  $("#instructions").hide();
  database.ref().child("/result").set("<p>Result:</p><p>These photo are from: "+ randomCity.name+"</p><p>Players Scores:</p><p>"+player1.name+" win: "+player1.win+" loss: "+ player1.loss+"</p><p>"+ player2.name+" win: "+player2.win+" loss: "+player2.loss+"</p>");

}


