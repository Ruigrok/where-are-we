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

//Empty array to place photoReferences returned from AJAX call
photoReferences = [];

//base url for display place images 
var baseimageurl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&key=AIzaSyB5-USGgBJR6SQE5bE-A8c58TcHkomHDck&photoreference="

//variabes for store each players object
var player1 = null;
var player2 = null;

$("#addPlayer").click(function(){
    event.preventDefault();

    var playerName=$("#name-input").val().trim();
//Player object will look like this:
// player#={
//   name:"";
//   win:0;
//   lose:0;
//   guessCoordinate:"";
//   diffDistance:0;
// }

    //check if both player exists
    if( !(player1 && player2))
    {
        //if there is no player one
        if (player1 === null)
        {
            //initialize player1 object
            player1 = {
                name: playerName,
                win: 0,
                loss: 0,
                tie: 0,
                guessCoordinate:"",
                diffDistance:0
            };
            playersRef.child(1).set(player1);
            // chatkey=chatRef.push().key;
            // chatRef.child(chatkey).set({name:playerName});
            thisPlayer=playerName; //store the player to the player's screen
            //set the turn indicator to 1
            database.ref().child("/turn").set(1);
            database.ref("/result").child("/round").set(0);
            
            database.ref("/players/1").onDisconnect().remove();

            

        }//if there is no player one
        else if (player2 === null)
        {
            //initialize player1 object
            player2 = {
                name: playerName,
                win: 0,
                loss: 0,
                tie: 0,
                guessCoordinate:"",
                diffDistance:0
            };
            playersRef.child(2).set(player2);
            database.ref("/result").child("/round").set(0);
            // chatkey=chatRef.push().key;
            // chatRef.child(chatkey).set({name:playerName});
            thisPlayer=playerName;
            database.ref("/players/2").onDisconnect().remove();

        }
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

});

// Result function comparing distance of player1&2 , and displaying the result havent done the restart game button yet 
function Result() {
  if (player1.diffDistance > player2.diffDistance) // player2 wins then
  {
    player2.win++;
    player1.lose++;
    $("#win").text(player2.win);
    $("#lose").text(player1.lose);
  }
  else if (player1.diffDistance < player2.diffDistance) //if player1 wins then 
  {
    player1.win++;
    player2.lose++;
    $("#win").text(player1.win);
    $("#lose").text(player2.lose);
  }
  else  // incase of a tie
  {
    alert("this never happens");
  }
}

//Use have users write their user id to a channel, and use security rules to limit the number of users in a room to 2



//This is the function for adding the pin-drop map
function initMap() {
  //Declare the starting location of the pin on the map
  var myLatLng = { lat: 0, lng: 0 };

  //Compiling a new map object
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: myLatLng,
    streetViewControl: false
  });

  //Creating the marker and making it draggable
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    draggable: true,
    title: "Drag me!"
  });

  //Use a listening event to retrieve the end value of where the marker is dragged to
  google.maps.event.addListener(marker, 'dragend', function () {
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();

    console.log(lat);
    console.log(lng);

    //Asssign the lat and lng values of the new marker location to #lat and #lng in the hidden form
    $('#lat').val(lat);
    $('#lng').val(lng);

    //Testing the distance calculation. We would change this to reference the specific location in an array of locations
    var pinDrop = new google.maps.LatLng(lat, lng);

    //store coordinate for player1
    playerRef.child("1/guessCoordinate").set(pinDrop);
    var newYork = new google.maps.LatLng(40.7128, -74.0059);

    var diffDist = google.maps.geometry.spherical.computeDistanceBetween(player1.guessCoordinate, newYork);

    //store difference distance for player1
    playersRef.child("1/diffDistance").set(diffDist);


  })
};

//Array of city objects. When we actually fill out all the city info we can move the array to another JS file to reduce clutter
var cities = [
  {
    name: "New York",
    lat: 40.7128,
    lng: -74.0059,
  },
  {
    name: "etc",
    lat: 0.00,
    lng: 0.00
  }
];

var randomCity = cities[Math.floor(Math.random() * cities.length)];
//var numberResults = 10

//Doing AJAX call to Google Places for the photos
var apiKey = "AIzaSyB5-USGgBJR6SQE5bE-A8c58TcHkomHDck";
var radius = 5000;
var queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" + apiKey;
queryURL += "&radius=" + radius;
queryURL += "&keyword=" + randomCity.name;
queryURL += "&location=" + randomCity.lat + "," + randomCity.lng;


function runQuery(queryURL) {
  $.ajax({ url: queryURL, method: "GET" })
    .done(function (response) {

      $('#photos').empty();

      var results = response.results;

      for (var i = 0; i < results.length; i++) {

        if (typeOf(results[i].photos) !== "undefined") {
          returnedPhoto = results[i].photos[0].photo_reference;
          photoReferences.push(returnedPhoto);
        }
      }
    })
//closing runQuery function
};


//function for display target destination photos
function displayPlacePhotos()
  {
    //tmp array for testing purpose
    var photoRefIds=["https://lh6.googleusercontent.com/-IoCBf7ZHrCs/V4dZSvupvzI/AAAAAAAA0mQ/YxzSoz0FiKg-kUdmimLSPk3sG-Bs0f5qACJkC/w400-h400-k/","https://lh3.googleusercontent.com/-C4-0ZpPCcLM/WE74Ae8DFYI/AAAAAAAB1Jw/8qF8gy2h5ioaMtnJxMZs61yRMJ_HLW81ACLIB/w400-h400-k/"];
    var carouselId="photoCarousel";
    var carouselRow=$("<div>");
    carouselRow.addClass("row");
    var carouselCol=$("<div>");
    carouselCol.addClass("col-md-8 col-md-offset-3");
    var carouselContent=$("<div>");
    carouselContent.addClass("carousel slide");
    carouselContent.attr("id",carouselId);
    carouselContent.attr("data-ride","carousel");
    var carIndicators=$("<ol>");
    carIndicators.addClass("carousel-indicators");
    var carInner=$("<div>");
    carInner.addClass("carousel-inner");
    carInner.attr("role","listbox");

    for(var i =0; i< photoRefIds.length;i++)
    {
      //list tags for carousel indicators section
      var carList=$("<li>");
      carList.attr("data-target",carouselId);
      carList.attr("data-slide-to",i);

      //add items to carousel inner section
      var carItem=$("<div>");
      
      var imgItem=$("<img>");
      imgItem.attr("src",photoRefIds[i]);
     
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

    // return carouselRow;
    $("#gamePlay").append(carouselRow);
// var photoDisp=displayPlacePhotos();
  // $("#gameplay").append(photoDisp);
}
