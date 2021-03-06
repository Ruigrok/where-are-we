// Initialize Firebase
/* var config = {
  apiKey: "AIzaSyB8PdcFQ8isaUyr33dV3cvGydDhMfI9mM0",
  authDomain: "where-are-we-84538.firebaseapp.com",
  databaseURL: "https://where-are-we-84538.firebaseio.com",
  projectId: "where-are-we-84538",
  storageBucket: "where-are-we-84538.appspot.com",
  messagingSenderId: "414783702161"
};
firebase.initializeApp(config); */

var config = {
  apiKey: "AIzaSyCcsty3-oBOJdE5-mqmLyqWmh87hy56icE",
  authDomain: "where-are-we-andrew.firebaseapp.com",
  databaseURL: "https://where-are-we-andrew.firebaseio.com",
  projectId: "where-are-we-andrew",
  storageBucket: "where-are-we-andrew.appspot.com",
  messagingSenderId: "814749241829"
};
firebase.initializeApp(config);

//set database object and neccessary groups
var database = firebase.database();
var playersRef = database.ref("/players");

//variabes for store each players object
var player1 = null;
var player2 = null;
var turn = 0;
var gameInitialized = true;
var playerName = "";
var thisPlayer = "";
var player1Ready, player2Ready;

//Array of city objects
var randomCity = null;

//these are variables for setting up guess map and getting target destination photos
var map, infoWindow, service, guessedLat, guessedLng, cityLocation, winner
var referenceArray = [];

//chat
var chatkey;

//player enter event
$("#addPlayer").click(function () {
  event.preventDefault();

  var error_element = $("span", $("#name-input").parent());
  if ($("#name-input").val() !== "") {
    error_element.removeClass("error_show").addClass("error");
    playerName = $("#name-input").val().trim();;
    enterGame();
  } else {
    error_element.removeClass("error").addClass("error_show");
  }
});

$("#name-input").keypress(function (e) {
  if (e.keycode === 13 && $("#name-input").val() !== "") {
    playerName = $("#name-input").val().trim();
    enterGame();
  }
});

$("body").on("click", "#submitAnswer", function () {
  if (turn === 1 && player1.name === thisPlayer) {
    storeGuessCoor_Diff("1");
    database.ref().child("/turn").set(2);

    $("#instructions").html("<h2>" + player1.name + ", <br> It's " + player2.name + "'s turn!" + "</h2>");
    $("body").scrollTop(0);
    $("#submitAnswer").remove();
  }

  if (turn === 2 && player2.name === thisPlayer) {
    storeGuessCoor_Diff("2");
    //When both players diffDistance values are in, call result function
    endGame();
  }
});
// Restarting the game when we press on nextRound
$("body").on("click", "#nextRound", function () {
  if (player1.name === thisPlayer && !player2Ready) {
    $("#instructions").html("<h2>Waiting for " + player2.name + " to be ready for the next round.<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i></h2>");
    $("body").scrollTop(0);
    database.ref().child("/nextRound/player1").set(true);
  } else if (player1.name === thisPlayer && player2Ready) {
    setupForNextRound();
    database.ref().child("/nextRound/player1").set(true);
  } else if (player2.name === thisPlayer && !player1Ready) {
    $("#instructions").html("<h2>Waiting for " + player1.name + " to be ready for the next round.<i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i></h2>");
    $("body").scrollTop(0);
    database.ref().child("/nextRound/player2").set(true);
  } else if (player2.name === thisPlayer && player1Ready) {
    setupForNextRound();
    database.ref().child("/nextRound/player2").set(true);
  }
});

function setupForNextRound() {
  database.ref("/photoReference").remove();
  database.ref().child("targetCity").remove();
  database.ref().child("result").remove();
  getNewCity();
}

function getNewCity() {
  randomCity = cities[Math.floor(Math.random() * cities.length)];
  database.ref().child("/targetCity").set(randomCity);
}

function storeGuessCoor_Diff(childPath) {
  //store guessed coordinates for player1
  playersRef.child(childPath + "/guessedLat").set(guessedLat);
  playersRef.child(childPath + "/guessedLng").set(guessedLng);
  //Create new LatLng object for players location, pulling lat and lng from firebase
  var guessedLocation = new google.maps.LatLng(guessedLat, guessedLng);
  //Testing the distance calculation
  var diffDist = google.maps.geometry.spherical.computeDistanceBetween(cityLocation, guessedLocation);
  //store difference distance
  playersRef.child(childPath + "/diffDistance").set(diffDist);
};

function enterGame() {
  if (player1 === null) {
    player1 = {
      name: playerName,
      win: 0,
      loss: 0,
      tie: 0,
      guessedLat: 0,
      guessedLng: 0,
      diffDistance: 0,
      playerNum: 1
    };

    thisPlayer = playerName;
    database.ref().child("/turn").set(1);
    getNewCity();

    $("#instructions").html("<h2>" + "Hi " + playerName + "! <br>Waiting on another player to join! <i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i></h2>");
    $("#name-form").hide();
    playersRef.child(1).set(player1);
    database.ref("/players/1").onDisconnect().remove();
  } 
  else if (player2 === null) {
    player2 = {
      name: playerName,
      win: 0,
      loss: 0,
      tie: 0,
      guessedLat: 0,
      guessedLng: 0,
      diffDistance: 0,
      playerNum: 2
    };
    $("#name-form").hide();
    thisPlayer = playerName;

    if (player1) {
      getNewCity();
    }
    database.ref().child("/turn").set(1);
    playersRef.child(2).set(player2);
    database.ref("/players/2").onDisconnect().remove();
  }
};

database.ref("/photoReference").on("value", function (snap) {
  if (snap.exists()) {
    referenceArray = snap.val();
    displayPlacePhotos();
  } else {
    referenceArray = [];
  }
});

//this is monitoring the value add in players group in the database
playersRef.on("value", function (snapshot) {
  if (snapshot.child("1").exists()) {
    player1 = snapshot.child("1").val();
  } else {
    player1 = null;
  }

  if (snapshot.child("2").exists()) {
    player2 = snapshot.child("2").val();
  } else {
    player2 = null;
  }

  //when both players are present, set up the game play screen
  if (player1 && player2) {
    gamePlay();
  }

  if (!player1 && !player2) {
    database.ref("/chats").remove();
  }
});

playersRef.on("child_removed", function (snapshot) {
  $("#gamePlay").empty();
  gameInitialized = true;

  //code from http://jsfiddle.net/dotnetCarpenter/KpM5j/
  //keep the chat always scrolled to the bottom
  var out = document.getElementById("chat-display");
  var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
  $("#chat-display").append("<div><i>" + snapshot.val().name + " has left the game</i></div>");

  if (isScrolledToBottom) {
    out.scrollTop = out.scrollHeight - out.clientHeight;
  }

  if (snapshot.val().name !== thisPlayer && thisPlayer) {
    $("#instructions").html("<h2>" + snapshot.val().name + " has left the game. <br> Waiting for another player to join! <i class=\"fa fa-spinner fa-pulse fa-2x fa-fw\"></i></h2>");
    getNewCity();
  }

  database.ref("/photoReference").remove();
  database.ref().child("/turn").remove();
  database.ref().child("targetCity").remove();
  database.ref().child("result").remove();
  database.ref().child("/nextRound").remove();
  database.ref().child(chatkey).remove();
});

database.ref().child("/turn").on("value", function (snap) {
  turn = snap.val();
  if (player1.name === thisPlayer && turn === 2) {
    $("#instructions").html("<h2>Hi " + player1.name + ", <br> It's " + player2.name + "'s turn!" + "</h2>");
  } else if (player2.name === thisPlayer && turn === 2) {
    $("#instructions").html("<h2>" + player2.name + ", <br> It's your turn!" + "</h2>");

    var button = $([
      '<div class="col-md-3">',
      '   <button type="button" id="submitAnswer" class="btn btn-default btn-lg btn-block">',
      '       Submit Your Answer',
      '   </button>',
      '</div>'
    ].join('\n'));
    guessMaps.append(button);
  }

  else if (turn === 0) {
    $("#instructions").html("<h2>" + winner + " wins! Are you ready to play another round?</h2>");
  }
});

database.ref().child("/targetCity").on("value", function (snap) {
  randomCity = snap.val();
});

database.ref().child("/result").on("value", function (snap) {
  if (snap.exists()) {
    $("#name-form").hide();
    $("#gamePlay").html(snap.val());
  } else {
    $("#gamePlay").empty();
  }
});

database.ref().child("/nextRound").on("value", function (snap) {
  if (snap.child("player1").exists()) {
    player1Ready = snap.child("player1").val();
  } else {
    player1Ready = false;
  }

  if (snap.child("player2").exists()) {
    player2Ready = snap.child("player2").val();
  } else {
    player2Ready = false;
  }

  if (player1Ready && player2Ready) {
    $("#gamePlay").empty();
    database.ref().child("/turn").set(1);
    gameInitialized = true;
    gamePlay();
  }
});

function gamePlay() {
  if (gameInitialized) {
    database.ref().child("/nextRound").remove();

    var map = $([
      '<div class="row" id="mapDiv">',
      '   <div class="col-md-7" id="map"></div>',
      '</div>'
    ].join('\n'));
    $("#gamePlay").append(map);

    if (player1.name === thisPlayer && turn === 1) {
      $("#instructions").html("<h2>" + player1.name + ", <br> It's your turn!" + "</h2>");

      var button = $([
        '<div class="col-md-3">',
        '   <button type="button" id="submitAnswer" class="btn btn-default btn-lg btn-block">',
        '       Submit Your Answer',
        '   </button>',
        '</div>'
      ].join('\n'));
      map.append(button);
    }
    else if (player2.name === thisPlayer && turn === 1) {
      $("#instructions").html("<h2>" + "Hi " + player2.name + ",<br>It's " + player1.name + "'s turn!" + "</h2>");
    }
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
  var styledMapType = new google.maps.StyledMapType([
    {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        { "visibility": "simplified" },
        { "hue": "#0066ff" },
        { "saturation": 74 },
        { "lightness": 100 }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        { "visibility": "off" },
        { "weight": 0.6 },
        { "saturation": -85 },
        { "lightness": 61 }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "road.arterial",
      "elementType": "all",
      "stylers": [{ "visibility": "off" }]
    },
    {
      "featureType": "road.local",
      "elementType": "all",
      "stylers": [{ "visibility": "on" }]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [{ "visibility": "simplified" }]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        { "visibility": "simplified" },
        { "color": "#5f94ff" },
        { "lightness": 26 },
        { "gamma": 2 }
      ]
    }
  ], { name: 'Styled Map' });

  //Create new LatLng object for the location of "randomCity"
  cityLocation = new google.maps.LatLng(randomCity.lat, randomCity.lng);

  //Compiling a new map object for guessing 
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 1,
    center: myLatLng,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeControlOptions: {
      mapTypeIds: ['styled_map']
    }
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  //Creating the marker and making it draggable for player to drag
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    animation: google.maps.Animation.DROP,
    draggable: true,
    title: "Drag me!"
  });

  //player1's marker listener for user's drag event
  google.maps.event.addListener(marker, 'dragend', function () {
    guessedLat = marker.getPosition().lat();
    guessedLng = marker.getPosition().lng();
  });
  //Establishing search request to Google Maps Places Library
  if (gameInitialized) {
    var request = {
      location: cityLocation,
      radius: 5000,
      keyword: randomCity.name,
    };

    infoWindow = new google.maps.InfoWindow();
    service = new google.maps.places.PlacesService(map);
    //Function for running search and assigning what's returned to a callback function
    service.nearbySearch(request, callback);
    gameInitialized = false;
  }
}
//======================================================

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  //retreive photos that represent the target destination
  if (referenceArray.length < 1) {
    for (var i = 0, result; result = results[i]; i++) {
      if (typeof result.photos !== 'undefined') {
        var cityPhoto = result.photos[0].getUrl({ 'maxWidth': 1140, 'maxHeight': 855 });
        referenceArray.push(cityPhoto);
      }
    }
    //store photoRefernce array into firebase
    database.ref("/photoReference").set(referenceArray);
  }
}

function displayPlacePhotos() {
  var carouselRow = $("<div>").addClass("row");
  var carouselCol = $("<div>").addClass("col-md-12");
  var carouselContent = $("<div>").addClass("carousel slide")
    .attr({
      'id': 'photoCarousel',
      'data-ride': 'carousel'
    })
  var carIndicators = $("<ol>").addClass("carousel-indicators");
  var carInner = $("<div>").addClass("carousel-inner").attr("role", "listbox");

  for (var i = 0; i < referenceArray.length; i++) {
    //list tags for carousel indicators section
    var carList = $("<li>")
      .attr({
        'data-target': 'photoCarousel',
        'data-slide-to': i
      })

    //add items to carousel inner section
    var carItem = $("<div>");

    var imgItem = $("<img>")
      .attr({
        'src': referenceArray[i],
        'style': 'margin: 0 auto'
      })

    if (i === 0) {
      carList.addClass("active");
      carItem.addClass("item active");
    }
    else {
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
}

// Result function comparing distance of player1&2 , and displaying the result havent done the restart game button yet 
function endGame() {

  if (player1.diffDistance > player2.diffDistance) {
    winner = player2.name;
    player1.loss++;
    playersRef.child("/1/loss").set(player1.loss);
    player2.win++;
    playersRef.child("/2/win").set(player2.win);
  } 
  else if (player1.diffDistance < player2.diffDistance) {
    winner = player1.name;
    player2.loss++;
    playersRef.child("/2/loss").set(player2.loss);
    player1.win++;
    playersRef.child("/1/win").set(player1.win);
  }
  else {
    winner = player1.name + " and " + player2.name;
    player2.tie++;
    playersRef.child("/2/tie").set(player2.tie);
    player1.tie++;
    playersRef.child("/1/tie").set(player1.tie);
  }
  resultScreen();
  database.ref().child("/turn").set(0);
};

playersRef.child("/1/win").on("value", function (snap) {
  winner = player1.name;
});

playersRef.child("/2/win").on("value", function (snap) {
  winner = player2.name;
});

function resultScreen() {

  database.ref().child("/result").set("<div class='row'><div class='col-md-8 col-md-offset-2'><div class='panel panel-default'><div class='panel-heading'><h3 class='panel-title'>Results</h3></div><div class='panel-body' id='resultDisplay'><table class='table table-condensed'><div id='resultMap'><img src=\"https://maps.googleapis.com/maps/api/staticmap?center="
    + randomCity.lat + "," + randomCity.lng + "&zoom=12&size=400x400&key=AIzaSyB5-USGgBJR6SQE5bE-A8c58TcHkomHDck&style=feature:administrative|element:all|visibility:off&style=feature:administrative.locality|element:all|visibility:simplified&style=feature:landscape|element:all|visibility:simplified|hue:0x0066ff|saturation:74|lightness:100&style=feature:poi|element:all|visibility:simplified&style=feature:road|element:all|visibility:simplified&style=feature:road.highway|element:all|visibility:off|weight:0.6|saturation:-85|lightness:61&style=feature:road.highway|element:geometry|visibility:on&style=feature:road.arterial|element:all|visibility:off&style=feature:road.local|element:all|visibility:on&style=feature:transit|element:all|visibility:simplified&style=feature:water|element:all|visibility:simplified|color:0x5f94ff|lightness:26|gamma:5.86\"></div><caption><h2>The city in the photos was <strong><a href=\"https://en.wikipedia.org/wiki/"
    + randomCity.name + "\" target=\"_blank\">"
    + randomCity.name + "</a></strong></h2></caption><thead><tr><th><i class='fa fa-tachometer fa-2x' aria-hidden='true'></i></th><th>"
    + player1.name + "</th><th>"
    + player2.name + "</th></tr></thead><tbody><tr><td>Wins</td><td>"
    + player1.win + "</td><td>"
    + player2.win + "</td></tr><tr><td>Losses</td><td>"
    + player1.loss + "</td><td>"
    + player2.loss + "</td></tr><tr><td>Off by</td><td>"
    + Math.round(player1.diffDistance / 1000) + "km </td><td>"
    + Math.round(player2.diffDistance / 1000) + "km </td></tr></tbody></table></div></div></div></div>"
    + "<div class='row'><div class='col-md-6 col-md-offset-3'><button id='nextRound' class='btn btn-default btn-lg btn-block'><i class='fa fa-globe fa-lg' aria-hidden='true'></i> Next Round</button></div></div>");
};

//Chat
$("#msgSend").click(function () {
  event.preventDefault();

  var error_element = $("span", $("#chat-input").parent());
  if (thisPlayer !== "") {
    var msg = $("#chat-input").val().trim();
    error_element.removeClass("error_show").addClass("error");
    chatkey = database.ref("/chats").push().key;
    database.ref("/chats").child(chatkey).set({ name: thisPlayer, msg: msg });
    $("#chat-input").val("");
  }
  else {
    error_element.removeClass("error").addClass("error_show");
    $("#chat-input").val("");
  }
});

database.ref("/chats").on("child_added", function (snapshot) {

  var chatname = snapshot.child("name").val();
  var chatmsg = snapshot.child("msg").val();

  var out = document.getElementById("chat-display");
  if (chatmsg) {
    // allow 1px inaccuracy by adding 1
    //code from http://jsfiddle.net/dotnetCarpenter/KpM5j/
    var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;

    var entry = $("<div>");
    var chatHeader = $("<div>").html("<strong>" + chatname + "</strong>");
    var chatbody = $("<div>").html("<p>" + chatmsg + "</p>");
    var chatImg = $("<img>");
    var imgspan = $("<span>");
    chatImg.addClass("img-circle");
    chatImg.attr("src", "https://via.placeholder.com/50//55C1E7/fff&text=" + chatname);
    if (chatname === player1.name) {
      entry.addClass("chatmsg player1msg");
      imgspan.addClass("pull-left");
      chatImg.attr("src", "https://via.placeholder.com/45/55C1E7/fff&text=" + chatname);

    } else if (chatname === player2.name) {
      entry.addClass("chatmsg player2msg");
      imgspan.addClass("pull-right");
      chatImg.attr("src", "https://via.placeholder.com/45/FA6F57/fff&text=" + chatname);
    }

    imgspan.append(chatImg);
    entry.append(imgspan, chatHeader, chatbody);

    $("#chat-display").append(entry);
    // scroll to bottom
    if (isScrolledToBottom) {
      out.scrollTop = out.scrollHeight - out.clientHeight;
    }
  }
});

playersRef.on("child_added", function (snapshot) {
  //put in chat message that a player has enter the game
  if (snapshot.val().name) {
    //code from http://jsfiddle.net/dotnetCarpenter/KpM5j/
    //keep the chat always scrolled to the bottom
    var out = document.getElementById("chat-display");
    var isScrolledToBottom = out.scrollHeight - out.clientHeight <= out.scrollTop + 1;
    $("#chat-display").append("<div class=\"chatmsg\"><i>" + snapshot.val().name + " is in the game</i></div>");

    // scroll to bottom
    if (isScrolledToBottom) {
      out.scrollTop = out.scrollHeight - out.clientHeight;
    }
  }
});






