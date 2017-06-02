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
        guessCoordinate: "",
        diffDistance: 0
      };
      playersRef.child(1).set(player1);
      // chatkey=chatRef.push().key;
      // chatRef.child(chatkey).set({name:playerName});
      thisPlayer = playerName; //store the player to the player's screen
      //set the turn indicator to 1
      database.ref().child("/turn").set(1);
      database.ref("/result").child("/round").set(0);

      database.ref("/players/1").onDisconnect().remove();



    }//if there is no player one
    else if (player2 === null) {
      //initialize player1 object
      player2 = {
        name: playerName,
        win: 0,
        loss: 0,
        tie: 0,
        guessCoordinate: "",
        diffDistance: 0
      };
      playersRef.child(2).set(player2);
      database.ref("/result").child("/round").set(0);
      // chatkey=chatRef.push().key;
      // chatRef.child(chatkey).set({name:playerName});
      thisPlayer = playerName;
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

//MAP AND IMAGE FUNCTIONS
//==========================================================

//Array of city objects. When we actually fill out all the city info we can move the array to another JS file to reduce clutter
var cities = [
  {
    name: "New York",
    lat: 40.7128,
    lng: -74.0059,
  },
];

var randomCity = cities[Math.floor(Math.random() * cities.length)];

var map;
var infoWindow;
var service;

var referenceArray = [];

//This is the function for adding the pin-drop map
function initMap() {
  //Declare the location of the default map pin
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
    var guessedLat = marker.getPosition().lat();
    var guessedLng = marker.getPosition().lng();

    console.log(guessedLat);
    console.log(guessedLng);

    //Asssign the lat and lng values of the new marker location to #lat and #lng in the hidden form
    $('#lat').val(guessedLat);
    $('#lng').val(guessedLng);

    //store guessed coordinates for player1
    playerRef.child("1/guessedLat").set(guessedLat);
    playerRef.child("1/guessedLng").set(guessedLng);


    //Create new LatLng object for players location, pulling lat and lng from firebase
    var guessedLocation = new google.maps.LatLng(player1.guessedLat, player1.guessedLng);

    //Create new LatLng object for the location of "randomCity"
    var cityLocation = new google.maps.LatLng(randomCity.lat, randomCity.lng);

    //Testing the distance calculation. We would change this to reference the specific location in an array of locations
    var diffDist = google.maps.geometry.spherical.computeDistanceBetween(cityLocation, guessedLocation);

    //store difference distance for player1
    playersRef.child("1/diffDistance").set(diffDist);

    //closing drag end event listener
  });

  //Establishing search request to Google Maps Places Library
  var request = {
    location: citySearch,
    radius: 5000,
    keyword: randomCity.name,
  };

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  //Function for running search and assigning what's returned to a callback function
  service.nearbySearch(request, callback);

  //Closing initMap();
}
//======================================================

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }

  for (var i = 0, result; result = results[i]; i++) {
    if (typeof result.photos !== 'undefined') {
      var cityPhoto = result.photos[0].getUrl({ 'maxWidth': 1140, 'maxHeight': 400 });
      referenceArray.push(cityPhoto);
    }
  }
}





