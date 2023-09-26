const apiKey = '32e85dc5d50ecade345eaa6e095ee37a';
const weatherDisplay = document.getElementById('weatherDisplay');
const locationInput = document.getElementById('locationInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const unitToggle = document.getElementById('unitToggle');
const waetherIcon = document.getElementById('icons');

getWeatherBtn.addEventListener('click', () => {
    const location = locationInput.value;
    const unit = unitToggle.value;

    if (location.trim() === '') {
        showError('Please enter a location.');
        return;
    }

    fetchWeather(location, unit);
});

function fetchWeather(location, unit) {
    // Use the fetch API to make an AJAX request to the weather API
    // Construct the API URL with the user's location and selected unit
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            if (data.cod === '404') {
                showError('Location not found. Please check your input.');
            } else {
                displayWeather(data, unit);
            }
        })
        .catch((error) => {
            showError('An error occurred while fetching weather data. Please try again.');
        });
}

function displayWeather(data, unit) {
    const { name, main, weather, wind } = data;
    const temperature = main.temp;
    const humidity = main.humidity;
    const description = weather[0].description;
    const windSpeed = wind.speed;
    

    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${temperature}°${unit === 'imperial' ? 'F' : 'C'}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Weather: ${description}</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function showError(message) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
}

// Optional: Geolocation
document.addEventListener('DOMContentLoaded', () => {
    if ('geolocation' in navigator) {
        const geoBtn = document.createElement('button');
        geoBtn.textContent = 'Use My Location';
        geoBtn.addEventListener('click', getLocation);
        document.querySelector('.search').appendChild(geoBtn);
    }
});

function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        fetchWeatherByCoords(latitude, longitude, unitToggle.value);
    }, () => {
        showError('Unable to retrieve your location.');
    });
}

function fetchWeatherByCoords(latitude, longitude, unit) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            displayWeather(data, unit);
        })
        .catch(() => {
            showError('An error occurred while fetching weather data. Please try again.');
        });
}
