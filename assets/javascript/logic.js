  // Initialize Firebase
  //Use have users write their user id to a channel, and use security rules to limit the number of users in a room to 2
   

//This is the function for adding the pin-drop map
function initMap() {
  //Declare the starting location of the pin on the map
  var myLatLng = {lat: 0, lng: 0};

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
    draggable:true,
    title:"Drag me!"
});

//Use a listening event to retrieve the end value of where the marker is dragged to
google.maps.event.addListener(marker, 'dragend', function() {
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