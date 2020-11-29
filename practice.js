const apiKey = "48a196e57dd05cb6e0a5a4111366b9c1";

//Variables
var lat = "";
var lon = "";
    let today = $("#currentDay");
    let cityName = $("#cityName");
    let humidity = $("#cityHumidity");
    let temp = $("#cityTemp");
    let wind = $("#cityWind");
    let cityUV = $("#cityUv");
let searchBar = $("#search-city");
let searchBtn = $("#search-btn");

let searchHistory = [];

//Current Weather Function
function currentWeather(city, apiKey) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    // UV index call
    function currentUV(lat, lon, apiKey) {
        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {
            //Attach UV parameters from Google
            cityUV.text("UV Index: " + response.value);
            if (response.value < 3) {
                cityUV.text("UV Index: " + response.value).attr("style", "background-color: green").append(" low");
            }
            else if (response.value >= 3 || response.value < 6) {
                cityUV.text("UV Index: " + response.value).attr("style", "background-color: yellow").append(" moderate");
            }
            else if (response.value >= 6 || response.value < 8) {
                cityUV.text("UV Index: " + response.value).attr("style", "background-color: orange").append(" high");
            }
            else if (response.value >= 8 || response.value < 11) {
                cityUV.text("UV Index: " + response.value).attr("style", "background-color: red").append(" very high");
            }
            else {
                cityUV.text("UV Index: " + response.value).attr("style", "background-color: violet").append(" extreme");
            }
        });
    };

    //Current Weather Call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        
            cityName.text(response.name);
            temp.text("Temperature: " + ((response.main.temp).toFixed(2) + "\xB0C"));
            humidity.text("Humidity: " + response.main.humidity + "%");
            wind.text("Wind Speed: " + response.wind.speed + " mph");

        //latitude and longitude
        lat = response.coord.lat;
        lon = response.coord.lon;
        //run the uv function
        currentUV(lat, lon, apiKey);
    })
};

// Five day forecast
function futureWeather(city, apiKey) {
    var queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    $.ajax({
        url: queryURL3,
        method: "GET"
    }).then(function (response) {
        // Forecast date
        for (i = 5; i < 40; i += 8) {
            var todayDate = $("<h5 class='card-title'>" + response.list[i].dt_txt + "</h5>")
            var img = $("<img>").attr("src", "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png")
            var temp = $("<p>Temp: " + response.list[i].main.temp + "</p>")
            var humidity = $("<p>Humidity: " + response.list[i].main.humidity + "%</p>")
            index = (i + 3) / 8;
            $("#day" + index).append(todayDate, img, temp, humidity);

        };
    })
};

//Run current weather and five day weather functions 
searchBtn.on("click", function (event) {
    event.preventDefault();
    var city = searchBar.val();
    currentWeather(city, apiKey);
    futureWeather(city, apiKey);
    /*attempted to set array and get array 
    searchHistory.push(city);
    localStorage.setItem("cityHistory", JSON.stringify(searchHistory));
    localStorage.getItem("cityHistory");
    $("#city-history").append("cityHistory"); */

});