// Initialize Firebase
//Use have users write their user id to a channel, and use security rules to limit the number of users in a room to 2

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
vary queryURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?l" + apiKey


function runQuery(randomCity, queryURL) {
  $.ajax({ url: queryURL, method: "GET" })
    .done(function (response) {

      $('#photos').empty();

      for (var i = 0; i < results.length; i++) {


        //Start dumping to HTML here
        var cityPhoto = $('<img>');
        wellSection.addClass("cityPhoto");
        wellSection.attr('id', 'photoWell-' + i);
        $('#wellSection').append(wellSection);

        //Check if things exist

        if (typeOf(response.results[i].photos) === "undefined")

          if (response.results[i].photos)

            response.results[i].photos[0].photo + reference)



})
        }



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

    //**Here we need to post these new vals to database "on submit"

    //Testing the distance calculation. We would change this to reference the specific location in an array of locations
    var pinDrop = new google.maps.LatLng(lat, lng);
    var newYork = new google.maps.LatLng(40.7128, -74.0059);

    console.log(google.maps.geometry.spherical.computeDistanceBetween(pinDrop, newYork));


  });

};