// Initialize Firebase
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
var instructionRef=database.ref("/instruction");


//variabes for store each players object
var player1 = null;
var player2 = null;
var turn=0;
var gameInitialized=true;
var thisPlayer;

//Array of city objects. When we actually fill out all the city info we can move the array to another JS file to reduce clutter

var randomCity = cities[Math.floor(Math.random() * cities.length)];

//these are variables for setting up guess map and getting target destination photos
var map;
var infoWindow;
var service;
var referenceArray = [];
var guessedLat, guessedLng;
var time = 100;

//player enter event
$("#addPlayer").click(function () {
  event.preventDefault();

  var playerName = $("#name-input").val().trim();
  //Player object will look like this:
  // player#={
  //   name:"";
  //   win:0;
  //   lose:0;
  //   guessCoordinate:"";
  //   diffDistance:0;
  // }

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
        guessedLng:0,
        diffDistance: 0
      };
      playersRef.child(1).set(player1);
      // chatkey=chatRef.push().key;
      // chatRef.child(chatkey).set({name:playerName});
      thisPlayer = playerName; //store the player to the player's screen
      //set the turn indicator to 1
      database.ref().child("/turn").set(1);
      // database.ref("/result").child("/round").set(0);

      database.ref("/players/1").onDisconnect().remove();

      $("#name-form").html("<div class= 'jumbotron' id='plm'>" + "<h3>" + "Waiting on Player 2 to join!" + "</h3>" + "</div>");
      $("#instructions").hide();
      //instructionRef.set("Waiting on Player 2 to join!")


    }//if there is no player one
    else if (player2 === null) {
      //initialize player1 object
      player2 = {
        name: playerName,
        win: 0,
        loss: 0,
        tie: 0,
        guessedLat: 0,
        guessedLng:0,
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


});

database.ref("/photoReference").on("value", function(snap){
  if(snap.exists())
  {
    referenceArray=snap.val();
    displayPlacePhotos();
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

  // //When both players diffDistance values are in, call result function
  // if(player1.diffDistance !== 0 && player2.diffDistance !== 0)
  // {
  //   endGame();
  // }

});


playersRef.on("child_removed", function (snapshot) {
  $("#gamePlay").empty();
  gameInitialized=true;
  database.ref("/photoReference").remove();
  referenceArray=[];

});

database.ref("/turn").on("value",function(snap){
  turn=snap.val();
});

function gamePlay()
  {
    if(gameInitialized)
    {//define the structure to store players' guess map
      var guessMaps=$("<div>");
      guessMaps.addClass("row");
      var guessMap1=$("<div>");
      guessMap1.addClass("col-md-6 col-md-offset-3");
      // var guessMap2=$("<div>");
      // guessMap2.addClass("col-md-6");
      guessMap1.attr("id","map");
      // guessMap2.attr("id","map2");

      
      //guessMaps.append(guessMap2);

      var guessSubmit=$("<button>");
      guessSubmit.addClass("btn btn-default btn-lg btn-block");
      guessSubmit.attr("id","guessSubmitBtn");
      //add submit button
      guessMap1.append(guessSubmit);

      guessMaps.append(guessMap1);
      $("#gamePlay").append(guessMaps);
      $("#instructions").hide();
      $("#plm").hide();
    }
    //call google map api
      initMap();
  };

//MAP AND IMAGE FUNCTIONS
//==========================================================
//Declare the location of the default map pin
  var myLatLng = { lat: 0, lng: 0 };
//This is the function for adding the pin-drop map
function initMap() {
  
  //Create new LatLng object for the location of "randomCity"
  var cityLocation = new google.maps.LatLng(randomCity.lat, randomCity.lng);

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

  //create player2's guess map
  // var map2 = new google.maps.Map(document.getElementById('map2'), {
  //   zoom: 1,
  //   center: myLatLng,
  //   streetViewControl: false
  // });

  //Creating the marker and making it draggable for player to drag
  //player2's draggable marker 
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

    //store guessed coordinates for player1
    playersRef.child("1/guessedLat").set(guessedLat);
    playersRef.child("1/guessedLng").set(guessedLng);


    //Create new LatLng object for players location, pulling lat and lng from firebase
    var guessedLocation = new google.maps.LatLng(player1.guessedLat, player1.guessedLng);
    myLatLng=guessedLocation;
    //Testing the distance calculation. We would change this to reference the specific location in an array of locations
    var diffDist = google.maps.geometry.spherical.computeDistanceBetween(cityLocation, guessedLocation);

    //store difference distance for player1
    playersRef.child("1/diffDistance").set(diffDist);

    //closing drag end event listener
  });


  //Use a listening event to retrieve the end value of where the marker is dragged to
  //player2's marker listener for user's drag event
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

  //retreive photos that represent the target destination
  for (var i = 0, result; result = results[i]; i++) {
    if (typeof result.photos !== 'undefined') {
      var cityPhoto = result.photos[0].getUrl({ 'maxWidth': 1140});
      referenceArray.push(cityPhoto);
    }
  }


  //store photoRefernce array into firebase
  database.ref("/photoReference").set(referenceArray);


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
    player2.win++;
    player1.loss++;
    playersRef.child("/1/loss").set(player1.loss);
    playersRef.child("/2/win").set(player2.win);

  }
  else if (player1.diffDistance < player2.diffDistance) //if player1 wins then 
  {
    player1.win++;
    player2.lose++;
    playersRef.child("/2/loss").set(player2.loss);
    playersRef.child("/1/win").set(player1.win);
  }
  else  // incase of a tie
  {
    //alert("this never happens");
    player1.tie++;
    player2.tie++;
    playersRef.child("/2/tie").set(player2.tie);
    playersRef.child("/1/tie").set(player1.tie);
  }

}



