let apiKey = "324c121360cd2aefafaa3940273e03b8"

//elements:
let searchBarEl = document.querySelector("#searchBar")
let cityInputEl = document.querySelector("#searchCity")
let infoDisplayEl = document.querySelector("#infoDisplay")

//functions:-------------------------------------------------------------------------------

//function for searching for city 
let searchWeather = function(event){ 
    event.preventDefault(); 

    let cityName = cityInputEl.value.trim();

    //display city searched!
    if (cityName){
        getWeather(cityName);
        cityInputEl.value = "";
    }else { //display error if blank city search
        alert("Please enter a city name!")
    }
};
//function to display searched city 

let getWeather = function (cityName){ 
    let apiurl = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+","+"&appid="+ apiKey
    fetch(apiurl)
    .then(function (displayInfo){ 
        if (response.ok){ 
            console.log(reponse); 
            response.json().then(function (data){ 
                console.log(data);
                displayWeather(data, cityName);
            });
        }else { 
            alert("Error:" + response.statusText); 
        }
    })
    .catch(function(error){ 
        alert("unable to connect to Open Weather Map");
    });
}

//function to save search to local storage
//----------------------------------------------------------------------------------------
//function to generate target city information 
//function to generate 5-day forecast
//----------------------------------------------------------------------------------------
//function to load and render search history 
//function to genereate search history
//function for button search history to submit new search request 
//function to clear history 
//----------------------------------------------------------------------------------------
//buttonhandler for "Search"
searchBarEl.addEventListener("submit", searchWeather);