// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
 // fetch from Geocoder API - http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// find parameters for city name, date, temperature, humidity, wind speed, icons, and the date

// lat & lon can be pulled from Geocoder API, need to store lat & lon as variables to use in OpenWeather API

// since city names can be the same explore having search bar show recommended cities based on what is typed in the search bar

// Create five-day forecast cards

// Save search history to local storage and display in search history, list items are clickable and will display the weather for that city

var APIkey = 'f4a839de064f3f8c4b41ed9b785c2131';
// added dummy lat & lon to test API
var weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast?';
var geocoderUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=';
var userSearch = document.getElementById("search-bar");
var searchBtn = document.getElementById("search-btn");

searchBtn.addEventListener('click', function(event) {
    event.preventDefault();

    var search = userSearch.value
    //console.log(search)
    getWeatherAPI(search);
});

function getWeatherAPI() {
    // fetch from Geocoder API
    var search = userSearch.value;
    var url1 = geocoderUrl + search + '&appid=' + APIkey;
    console.log(url1)
    console.log(search)
    fetch(url1).then(function(response) {
        return response.json(); 
        
        // place second fetch for OpenWeather API within fetch for Geocoder API
    }) .then(function(data) {
        console.log(data[0].lat) // data[0].lat & data[0].lon are the lat & lon for the city searched

        var lat = data[0].lat;
        var lon = data[0].lon;
        var url2 = weatherUrl + 'lat=' + lat + '&lon=' + lon + '&appid=' + APIkey;
        console.log(url2);
        fetch(url2).then(function(response) {
            return response.json();
        }) .then(function(data) {
            console.log(data);
            // temperature is in Kelvin, need to convert to F
            // time displayed is in UTC, need to convert to local time list.dt. actually dt_txt displays the date & time
        })
    });
    // define parameters to add to fetch url, store lat & lon as variables to use in OpenWeather API
}