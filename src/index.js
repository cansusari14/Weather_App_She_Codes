let date = new Date();
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sun", "Sat"];
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

function getWeather(city) {
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}
function showPosition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
  axios.get(apiURL).then(showTemperature);
}
var str = "How are you doing today?";
var res = str.split(" ");

function showTemperature(response) {
  tempDisplay.innerHTML = `${Math.round(response.data.main.temp)}`;
  celciusTemperature = response.data.main.temp;
  currentCity.innerHTML = `${response.data.name}`;
  weatherDescription.innerHTML = `${response.data.weather[0].description}`;
  humidityDisplay.innerHTML = `${response.data.main.humidity}%`;
  windDisplay.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector(".search-bar");
  let city = searchInput.value;
  city = city.charAt(0).toUpperCase() + city.slice(1);
  currentCity.innerHTML = `${city}`;
  getWeather(city);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let fahrenheitTemperature = (tempDisplay.innerHTML * 9) / 5 + 32;
  tempDisplay.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelciusTemperature(event) {
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
