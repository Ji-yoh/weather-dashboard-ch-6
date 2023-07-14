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
var resultBox = document.getElementById("result-box"); // position search results under search bar
var searchBtn = document.getElementById("search-btn");
var searchHistory = document.getElementById("search-history"); // position search history list under search bar
var currentWeather = document.getElementById("current-weather"); // current weather will be displayed to the top right of the search bar
var forcastWeather = document.getElementById("forcast-weather"); // forcast weather will be displayed below the current weather
var cityList = []; // save searched cities to local storage in an array


function initializePage() { // initialize page with search history from local storage
    var savedCities = JSON.parse(localStorage.getItem('cityList'));

    if (savedCities !== null) {
        cityList = savedCities;
    }
}

function saveCityList() {
    localStorage.setItem("cityList", JSON.stringify(cityList)); // store searched cities in local storage
}

searchBtn.addEventListener('click', function(event) {
    event.preventDefault();

    var search = userSearch.value
    cityList.push(search);

    saveCityList();
    //console.log(search)
    getWeatherAPI(search);
});

function getWeatherAPI() {
    // fetch from Geocoder API
    var search = userSearch.value;
    var url1 = geocoderUrl + search + '&limit=5' +'&appid=' + APIkey; // added limit=5 to only show 5 recommended cities
    // if city name has multiple results, display all results under search bar. pull city name, state, and country code from Geocoder API
    console.log(url1)
    console.log(search)
    fetch(url1).then(function(response) {
        return response.json(); 
        
        // place second fetch for OpenWeather API within fetch for Geocoder API
    }) .then(function(data) {
        // console.log(data)
        // console.log(data[1].lat) // data[0].lat & data[0].lon are the lat & lon for the city searched (only shows one result)

        /* 
        var citySearchResults = data.values();
        for (let city of citySearchResults) {
            var citySearchList = document.createElement("li");
            citySearchList.textContent = city.name + ', ' + city.state + ', ' + city.country;
            resultBox.appendChild(citySearchList);
        }  
        */

        var lat = data[0].lat;
        var lon = data[0].lon;
        var url2 = weatherUrl + 'lat=' + lat + '&lon=' + lon + '&appid=' + APIkey;
        console.log(url2);
        fetch(url2).then(function(response) {
            return response.json();
        }) .then(function(data) {
            //console.log(data);
            // temperature is in Kelvin, need to convert to F
            // time displayed is in UTC, need to convert to local time list.dt. actually dt_txt displays the date & time
        })
    });
    // define parameters to add to fetch url, store lat & lon as variables to use in OpenWeather API
}

initializePage();