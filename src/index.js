let date = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let day = days[date.getDay()];
let hour = date.getHours();
if (hour < 10) {
  hour = `0${hour}`;
}
let minute = date.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

let dateDisplay = document.querySelector(".current-date");
dateDisplay.innerHTML = `Today | ${day}, ${hour}:${minute}`;
let apiKey = "995d2282655743a8f4d6521ab4e2c0d9";
let currentCity = document.querySelector("h1");
let weatherDescription = document.querySelector(".weather-description");
let tempDisplay = document.querySelector("#temperature");
let humidityDisplay = document.querySelector("#humidity");
let windDisplay = document.querySelector("#wind");
let iconElement = document.querySelector("#current-icon");

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = "";

  for (let index = 1; index <= 5; index++) {
    let currentDay =
      daysShort[new Date(response.data.daily[index].dt * 1000).getDay()];
    let forecast = response.data.daily[index];
    forecastElement.innerHTML += ` <div class="col forecast">
            <h6>${currentDay}</h6>
            <img src="assets/${
              forecast.weather[0].icon
            }.svg" class="forecast-images" style="width:60px;height:60px;"/>
            <p>${Math.round(response.data.daily[index].temp.max)}°C</p>
          </div>`;
  }
}

function getWeather(city) {
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios
    .get(apiUrl)
    .then(function (response) {
      showTemperature(response);
      apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&
  exclude=current,minutely,hourly&appid=${apiKey}&units=${units}`;
      axios.get(apiUrl).then(displayForecast);
    })
    .catch(function () {
      alert("Oops, could not find the city you were looking for!");
    });
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(showTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&
  exclude=current,minutely,hourly&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  console.log(response);
  celciusTemperature = response.data.main.temp;
  tempDisplay.innerHTML = `${Math.round(response.data.main.temp)}`;
  currentCity.innerHTML = `${response.data.name}`;
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;
  humidityDisplay.innerHTML = `${response.data.main.humidity}%`;
  windDisplay.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  iconElement.setAttribute(
    "src",
    `assets/${response.data.weather[0].icon}.svg`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector(".search-bar");
  let city = searchInput.value;
  city = city.charAt(0).toUpperCase() + city.slice(1);
  getWeather(city);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  tempDisplay.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelciusTemperature(event) {
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  event.preventDefault();
  tempDisplay.innerHTML = Math.round(celciusTemperature);
}

let form = document.querySelector(".search");
form.addEventListener("submit", search);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", handleClick);
function handleClick(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showPosition);
}
let celciusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

getWeather("istanbul");
