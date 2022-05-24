var OWApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
var OWApiKey = '9389b37656f995eb63f43c56175b9777';
var ipApiUrl = 'http://ip-api.com/json/?fields=status,country,city,lat,lon,timezone'

$(document).ready(function(){
	//Toggle between centigrade and fahrenheit
	$('.centigrade, .fahrenheit').on('click', function(){
		$('.centigrade, .fahrenheit').toggle();
	});
	
	//GPS button click handler
	$('#gpsButton').on('click', function(){
		getPositionWithGPS();
	});

	//Getting coordinates on page load
	getPositionByIp();
});

//This function retrieves visitors coordinates by IP
function getPositionByIp(){
	$.ajax({
		type: 'POST',
		url: ipApiUrl,
		data: {},
		dataType: "jsonp",
		success: function(data){
			getWeatherData(data.lat, data.lon);
		},
		error: function(){
		},
		complete: function(){
		}
	});
}

//Getting weather data by coordinates
function getWeatherData(lat, lon){
	$.ajax({
		type: 'POST',
		url: OWApiUrl + '?units=metric&lat=' + lat + '&lon=' + lon + '&appid=' + OWApiKey,
		data: {},
		dataType: "jsonp",
		success: function(data){
			console.log(data);
			$('.centigrade h2').html( Math.round(data.main.temp) + '<span>°C</span>' );
			$('.centigrade .feelsLike').html('Feels like: ' + Math.round(data.main.feels_like) + ' °C' );
			$('.fahrenheit h2').html( Math.round(data.main.temp * 9/5 + 32) + '<span>°F</span>' );
			$('.fahrenheit .feelsLike').html('Feels like: ' + Math.round(data.main.feels_like * 9/5 + 32) + ' °F' );
			
			$('.timezone').text(data.name);
			$('.icon').html('<img src=icons/' + getIcon(data.weather[0].main) + '>');
			$('.temperature-description').text(data.weather[0].description);
		},
		error: function(){
		},
		complete: function(){
			$('#loaderIcon').hide();
		}
	});
}

//Initializing google map
function initMap() {
  const originalMapCenter = new google.maps.LatLng(58.9399427, 13.4328307);
  const map = new google.maps.Map(document.getElementById("embeddedMap"), {
    zoom: 6,
    center: originalMapCenter,
  });
  
  map.addListener("click", (event) => {
	  getWeatherData(
		event.latLng.lat(),
		event.latLng.lng()
	  );
  });
  
  
}


//weather icons
function getIcon(weatherMain){
    let icon;
    switch (weatherMain) {
        case 'Thunderstorm':
            icon = `${weatherMain}.svg`;
            break;
        case 'Drizzle':
            icon = `${weatherMain}.svg`;
            break;
        case 'Rain':
            icon = `${weatherMain}.svg`;
            break;
        case 'Snow':
            icon = `${weatherMain}.svg`;
            break;
        case 'Clear':
            icon = weatherMain +'-' + getDayOrNight() + '.svg';
            break;
        case 'Clouds':
            icon = `${weatherMain}.svg`;
            break;
        case 'Atmosphere':
            icon = weatherMain +'-' + getDayOrNight() + '.svg';
            break;
		default:
			icon = `weather.svg`;
            break;
    }
    return icon;
}

//day or night recognition
function getDayOrNight() {
    let DayOrNigh;
    var d = new Date();

    const hour = d.getHours();

    if (hour >= 6 && hour <= 19) {
        DayOrNigh = 'Day';
    } else {
        DayOrNigh = 'Night';
    }

    return DayOrNigh;
}


// Getting coordinates with GPS
function getPositionWithGPS(){
	// Checking browser support (start)
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(receivedGpsPosition);
	} else {
		alert('Your browser does not support GPS');
	}
	// Checking browser support (end)
}

//GPS coordinate callback
function receivedGpsPosition(position){
	if (typeof position == 'object'){
		getWeatherData(position.coords.latitude, position.coords.longitude);
	}
}

