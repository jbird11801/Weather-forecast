// global variables 

var cityInp = $("#cityInp");

var searchBut = $("#search");

var currentDayTemp = $("#Temp");

var currentDayWind = $("#Wind");

var currentDayHumidity = $("#Humidity");

var locationName = $("#locationName");

var WeatherIcon = $("#WeatherIcon");

var FutureForcast = [$("#day1"),$("#day2"),$("#day3"),$("#day4"),$("#day5"),];

var forecast = $("#forecast");

var PastLocal = $("#PastLocal");

var pastLocations = [];

var pastLocationsls = [];

var PastLocalButt = [];

// loads past searches

pastLocationsls = JSON.parse(localStorage.getItem("pastLocationsls"));

if ( pastLocationsls !== null){

    pastLocations = pastLocationsls;

    for(var i = 0 ; i < pastLocationsls.length ; i++){

        oldLocations(i);

    }

}



// sets the forcast to be hidden on page load

forecast.hide();

// starts search for the inputed name

searchBut.on("click" , function(){

    if (cityInp.val() !== ""){

        getGeocodingApi (cityInp.val())

    }

});

// gets cords on item name

function getGeocodingApi (input) {

    var GeocodingLink = 'http://api.openweathermap.org/geo/1.0/direct?q='+input+'&limit=1&appid=cb2e3e3fa680c7a0270bf0248a21b14d';

    fetch(GeocodingLink)

    .then( function (response){

        return response.json();

    })

    .then(function (data) {

        forecast.show();

        getWeather ( data[0].lat , data[0].lon , true);
    
    })

}

// gets the weather based on cords 

function getWeather ( lat , lon , newSearch){

    var weatherLink = 'https://api.openweathermap.org/data/2.5/forecast?lat='+lat+'&lon='+lon+'&cnt=50&appid=cb2e3e3fa680c7a0270bf0248a21b14d&units=imperial';

    fetch(weatherLink)

    .then( function (response){

        return response.json();

    })

    .then(function (data) {

        console.log(data)

        if ( newSearch === true){

            pastLocations.unshift({

                lat : lat,
    
                lon : lon,
    
                name : data.city.name
    
            });

            oldLocations (0);

        }

        if( pastLocations.length > 9 ){

            pastLocations.pop();

            PastLocalButt[PastLocalButt.length-1].css("display", "none");

            PastLocalButt.pop();

        }

        localStorage.setItem('pastLocationsls', JSON.stringify(pastLocations));

        currentDayTemp.text(data.list[0].main.temp + " *f");

        currentDayWind.text(data.list[0].wind.speed + " mph");

        currentDayHumidity.text(data.list[0].main.humidity + " % ");

        locationName.text(data.city.name + " " +  data.list[0].dt_txt.slice(0,11));

        console.log("https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png")

        WeatherIcon.attr("src" , "https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png");

        for (var i = 0; i < FutureForcast.length ; i++){

            FutureForcast[i].find("h6").text(data.list[(i)*8].dt_txt.slice(0,11));

            FutureForcast[i].find("img").attr("src" , "https://openweathermap.org/img/wn/" + data.list[(i)*8].weather[0].icon + "@2x.png");
        
            FutureForcast[i].find("#Temp").text("Temp : " + data.list[(i)*8].main.temp + " *f");

            FutureForcast[i].find("#Wind").text("Wind : " + data.list[(i)*8].wind.speed + " mph");

            FutureForcast[i].find("#Humidity").text("Humidity : " + data.list[(i)*8].main.humidity + " % ");

        }

    })

}

// makes a button for past searches

function oldLocations (index) {

    PastLocalButt.unshift($("<button/>"));

    PastLocal.append(PastLocalButt[0]);

    PastLocalButt[0].addClass("BackgroundCustom");

    PastLocalButt[0].text(pastLocations[index].name);

}

// pulls up the weather for a clicked past location

PastLocal.on("click" , function(event){

    var clicked = event.target;

    forecast.show();

    for(var i = 0; i < pastLocations.length; i++){

        if(clicked.textContent === pastLocations[i].name){

            getWeather ( pastLocations[i].lat , pastLocations[i].lon , false)

            break;

        }

    }

});




