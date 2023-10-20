// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
 // fetch from Geocoder API - http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// find parameters for city name, date, temperature, humidity, wind speed, icons, and the date

// Create five-day forecast cards

// Math.floor() to round down temperature

var APIkey = 'f4a839de064f3f8c4b41ed9b785c2131';
// added dummy lat & lon to test API
var weatherUrl = 'http://api.openweathermap.org/data/2.5/forecast?';
var geocoderUrl = 'http://api.openweathermap.org/geo/1.0/direct?q='; // there is also a one-call API that can be used to get current weather and 5-day forecast
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
    
    renderCityList(cityList);
}

function saveCityList() { // store searched cities in local storage
    cityList.unshift(userSearch.value);
    if (cityList.length > 5) {
        cityList.pop();
    }

    localStorage.setItem("cityList", JSON.stringify(cityList)); 
}


function renderCityList() { // create function that renders search history list from local storage, buttons should be clickable to display weather for that city
    searchHistory.innerHTML = "";
    for (var i = 0; i < cityList.length; i++) {
        var city = document.createElement("button");
        city.setAttribute("class", "saved-city");
        city.textContent = cityList[i];
        searchHistory.appendChild(city);
    }

}

searchBtn.addEventListener('click', function(event) {
    event.preventDefault();

    var search = userSearch.value

    saveCityList();
    //console.log(search)
    getWeatherAPI(search);

});

function getWeatherAPI() { // lat & lon can be pulled from Geocoder API, need to store lat & lon as variables to use in OpenWeather API

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
            var currentTemp = data.list[0].main.temp;
            var currentHumidity = data.list[0].main.humidity;
            var currentWind = data.list[0].wind.speed;
            var currentIcon = data.list[0].weather[0].icon;
            var currentCity = data.city.name;
            var currentCloud = data.list[0].clouds.all;

            var currentTempF = Math.floor((currentTemp - 273.15) * 1.8 + 32);
            
            // added card to display current weather
            var currentWeatherBox = document.createElement("div");
            currentWeatherBox.innerHTML = `
            <div class="current-weather-box">    
                <h2>${currentCity}</h2>
                <p>Temperature: ${currentTempF}°F</p>
                <p>Humidity: ${currentHumidity}%</p>
                <p>Cloudiness: ${currentCloud}%</p>
                <p>Wind: ${currentWind} MPH</p>
                <img src="http://openweathermap.org/img/w/${currentIcon}.png">
            </div>
                `;

            currentWeather.appendChild(currentWeatherBox);

            // get 5-day forecast from OpenWeather API
            // create cards to display 5-day forecast
            var forcastWeatherBox = '';
            for (var i =0; i < 5; i++) {
                var forcastDate = data.list[i].dt_txt;
                var forcastTemp = data.list[i].main.temp;
                var forcastCloud = data.list[i].clouds.all;
                var forcastHumidity = data.list[i].main.humidity;
                var forcastWind = data.list[i].wind.speed;
                var forcastIcon = data.list[i].weather[0].icon;
                var forcastTempF = Math.floor((forcastTemp - 273.15) * 1.8 + 32);
                forcastWeatherBox += `
                <div class="forcast-weather-box">
                    <h3>${forcastDate}</h3>
                    <p>Temperature: ${forcastTempF}°F</p>
                    <p>Humidity: ${forcastHumidity}%</p>
                    <p>Cloudiness: ${forcastCloud}%</p>
                    <p>Wind: ${forcastWind} MPH</p>
                    <img src="http://openweathermap.org/img/w/${forcastIcon}.png">
                </div>
                `
            }
            forcastWeather.innerHTML = forcastWeatherBox;
        })
    })
};
// define parameters to add to fetch url, store lat & lon as variables to use in OpenWeather API


initializePage();