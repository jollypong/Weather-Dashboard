//elements:
//general element
let apiKey = "324c121360cd2aefafaa3940273e03b8";
//elements used in function fetchWeather
let searchBarEl = document.querySelector("#searchBar");
let cityInputEl = document.querySelector("#searchCity");
let infoDisplayEl = document.querySelector("#infoDisplay");
//elements used infunction Displayweather
let cityId = document.querySelector("#cityId");
let dateEl = document.querySelector("#date");
let iconEl = document.querySelector("#icon")
let temperatureEl = document.querySelector("#temperature");
let feelsLikeEl = document.querySelector("#feelsLike");
let humidityEl = document.querySelector("#humidity");
let windEl = document.querySelector("#wind");
let uvEl = document.querySelector("#uvIndex");
//elements used in function render searchHistory 
let searchHistory = [];
let clearButtonEl = document.querySelector("#clearButton");
let historyEl = document.querySelector("#searchHistory");
//elements used in function to create 5dayCard
let weatherCards = document.querySelector("#weatherCards")

//functions:-------------------------------------------------------------------------------

//function for searching for city 
let searchWeather = function(event){ 
    event.preventDefault(); 

    let cityName = cityInputEl.value.trim();

    //display city searched!
    if (cityName){
        fetchWeather(cityName);
        searchHistory.push(cityName); //add cityName to searchHistory array
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));//save to localStorage
        cityInputEl.value = "";
    }else { //display error if blank city search
        alert("Please enter a city name!")
    }
};

//function to fetch searched city 
let fetchWeather = function (cityName){ 
    let apiurl = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+ apiKey 
    fetch(apiurl) //fetch the url using above variable
    .then(function(response){ 
        // console.log(response) 
        if (response.ok){ 
            response.json() //json the api resonse 
            .then(function (data){ //function to grab latitude/longitude so we can use One Call API
                // console.log(data);
                //display city name using variable
                cityId.textContent = cityName;
                //display date using momentjs
                dateEl.textContent = moment().format("MM/DD/YYYY");
                //display icon of weather from data 
                let weatherIcon = 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
                console.log(weatherIcon);
                iconEl.src = weatherIcon
                // iconEl.setAttribute("src", "weatherIcon")
                //grab latitude and longitude from data
                let long = data.coord.lon; 
                // console.log(long)
                let lat = data.coord.lat; 
                 // console.log(lat)
                let oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude={part}&units=metric&appid=" + apiKey
                // console.log(uvURL)

                fetch(oneCallURL) //fetch oneCall API that contains UVI and Weather info
                .then(function(response){ 
                    response.json()
                    .then(function(data){
                        console.log(data);
                        //display data to container
                        temperatureEl.textContent = data.current.temp;
                        feelsLikeEl.textContent = data.current.feels_like;
                        humidityEl.textContent = data.current.humidity;
                        windEl.textContent = data.current.wind_speed;
                        uvEl.textContent = data.current.uvi; 
                        //create uvi color depending on level
                        if (data.current.uvi <= 2) {
                            uvEl.setAttribute("class","bg-info m-1 p-1 border")
                        } else if (uvi > 2 && uvi <= 5) {
                            uvEl.setAttribute("class","bg-success m-1 p-1 border")
                        } else if (uvi > 5 && uvi <= 8) {
                            uvEl.setAttribute("class","bg-warning m-1 p-1 border")
                        } else {
                            uvEl.setAttribute("class","bg-danger m-1 p-1 border")
                        };

                    //delete cards prior to adding more cards on new search 
                    weatherCards.innerHTML = "";    
                    //function to generate 5-day forecast
                    for (let i = 0; i < 5; i++){
                        //create card for 5-day forecast 
                        let forecastIcon = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';
                        // console.log(forecastIcon)
                        let forecastDate = moment().add(i + 1, "days").format("MM/DD/YYYY");
                        let forecastTemp = data.daily[i].temp.day;
                        let forecastWind = data.daily[i].wind_speed;
                        let forecastHumidity = data.daily[i].humidity;

                        let cardContent = //design elements for bootstrap for div below
                            '<div class = "card bg-primary text-light mx-3 my-1" style="width: 15rem">' +
                                '<h5 class = "card-header">' + forecastDate + '</h5>' +
                                '<img clas = card-body src=' + forecastIcon + '></img>' + 
                                '<p class = "card-body">Temperature:' + forecastTemp + '&deg;C</p>' +
                                '<p class = "card-body">Wind Speed: ' + forecastWind + 'm/s</p>' +
                                '<p class = "card-body">Humidity: ' + forecastHumidity + '%</p>' +
                            '</div>'
                        //add cardContent to weatherCards https://stackoverflow.com/questions/42517697/appending-html-using-native-javascript
                        weatherCards.innerHTML = weatherCards.innerHTML + cardContent;
                        }
                    })
                })
            });
        }else { 
            alert("Error:" + response.statusText); 
        };
    })
}

//function to load parse search History
let previousCities = JSON.parse(localStorage.getItem("searchHistory"))
    for (let i = 0; i <searchHistory.length; i++){ 
        let searchButton = document.createElement("button");
        searchButton.classList.add("m-2 btn btn-info"); 
        searchButton.dataset.cityName = searchHistory[i]; 
        searchButton.textContent = searchHistory[i];
    }
    historyEl.appendChild(searchButton);

//function to clear history 
function clearHistory(){
    localStorage.clear(); 
    location.reload(); 
}

//button handler for clearButton
clearButtonEl.addEventListener("click", clearHistory);

//buttonhandler for "Search"
searchBarEl.addEventListener("submit", searchWeather);