

  // Result function comparing distance of player1&2 , and displaying the result havent done the restart game button yet 
  	function Result()
  	{
  		if(player1.diffDistance>player2.diffDistance) // player2 wins then
  		{
  			player2.win++;
  			player1.lose++;
  			$("#win").text(player2.win);
  			$("#lose").text(player1.lose);
  		}
  		else if(player1.diffDistance<player2.diffDistance) //if player1 wins then 
  		{
  			player1.win++;
  			player2.lose++;
  			$("#win").text(player1.win);
  			if("#lose").text(player2.lose);
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





};