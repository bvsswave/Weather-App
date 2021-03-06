// CRITERIA

// GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


function initPage() {
  const cityEl = document.getElementById("enter-city");
  const searchEl = document.getElementById("search-button");
  const clearEl = document.getElementById("clear-history");
  const nameEl = document.getElementById("city-name");
  const currentPicEl = document.getElementById("current-pic");
  const currentTempEl = document.getElementById("temperature");
  const currentHumidityEl = document.getElementById("humidity");
  const currentWindEl = document.getElementById("wind-speed");
  const currentUVEl = document.getElementById("UV-index");
  const historyEl = document.getElementById("history");
  var fivedayEl = document.getElementById("fiveday-header");
  var todayweatherEl = document.getElementById("today-weather");
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

  // assigning generated API key to variable
  const APIKey = "a7339f072f7f793307e26db9070bf83b";

  function getWeather(cityName) {
      // showing current weather taken from weather api
      let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
      axios.get(queryURL)
          .then(function (response) {

              todayweatherEl.classList.remove("d-none");

            //   WHEN I view current weather conditions for that city

              const currentDate = new Date(response.data.dt * 1000);
              const day = currentDate.getDate();
              const month = currentDate.getMonth() + 1;
              const year = currentDate.getFullYear();
              nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
              let weatherPic = response.data.weather[0].icon;
              currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
              currentPicEl.setAttribute("alt", response.data.weather[0].description);
              currentTempEl.innerHTML = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
              currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
              currentWindEl.innerHTML = "Wind Speed: " + response.data.wind.speed + " MPH";
              
              let lat = response.data.coord.lat;
              let lon = response.data.coord.lon;
              let UVQueryURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
              axios.get(UVQueryURL)
                  .then(function (response) {
                      let UVIndex = document.createElement("span");
                      
                      if (response.data[0].value < 4 ) {
                          UVIndex.setAttribute("class", "badge badge-success");
                      }
                      else if (response.data[0].value < 8) {
                          UVIndex.setAttribute("class", "badge badge-warning");
                      }
                      else {
                          UVIndex.setAttribute("class", "badge badge-danger");
                      }
                      console.log(response.data[0].value)
                      UVIndex.innerHTML = response.data[0].value;
                      currentUVEl.innerHTML = "UV Index: ";
                      currentUVEl.append(UVIndex);
                  });
              
            //   THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

              let cityID = response.data.id;
              let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
              axios.get(forecastQueryURL)
                  .then(function (response) {
                      fivedayEl.classList.remove("d-none");
                      
                      //  pushes response to display forecast
                      const forecastEls = document.querySelectorAll(".forecast");
                      for (i = 0; i < forecastEls.length; i++) {
                          forecastEls[i].innerHTML = "";
                          const forecastIndex = i * 8 + 4;
                          const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                          const forecastDay = forecastDate.getDate();
                          const forecastMonth = forecastDate.getMonth() + 1;
                          const forecastYear = forecastDate.getFullYear();
                          const forecastDateEl = document.createElement("p");
                          forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                          forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                          forecastEls[i].append(forecastDateEl);

                          // icons on daily weather
                          const forecastWeatherEl = document.createElement("img");
                          forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                          forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                          forecastEls[i].append(forecastWeatherEl);
                          const forecastTempEl = document.createElement("p");
                          forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                          forecastEls[i].append(forecastTempEl);
                          const forecastHumidityEl = document.createElement("p");
                          forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                          forecastEls[i].append(forecastHumidityEl);
                      }
                  })
          });
  }

//   WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city


  searchEl.addEventListener("click", function () {
      const searchTerm = cityEl.value;
      getWeather(searchTerm);
      searchHistory.push(searchTerm);
      localStorage.setItem("search", JSON.stringify(searchHistory));
      renderSearchHistory();
  })

  // clear History button
  clearEl.addEventListener("click", function () {
      localStorage.clear();
      searchHistory = [];
      renderSearchHistory();
  })

  function k2f(K) {
      return Math.floor((K - 273.15) * 1.8 + 32);
  }

  function renderSearchHistory() {
      historyEl.innerHTML = "";
      for (let i = 0; i < searchHistory.length; i++) {
          const historyItem = document.createElement("input");
          historyItem.setAttribute("type", "text");
          historyItem.setAttribute("readonly", true);
          historyItem.setAttribute("class", "form-control d-block bg-white");
          historyItem.setAttribute("value", searchHistory[i]);
          historyItem.addEventListener("click", function () {
              getWeather(historyItem.value);
          })
          historyEl.append(historyItem);

          console.log(localStorage)
      }
  }

  renderSearchHistory();
  if (searchHistory.length > 0) {
      getWeather(searchHistory[searchHistory.length - 1]);
  }
  
}

initPage();