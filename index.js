// script.js
const apiKey = 'YOUR_API_KEY';
const weatherDisplay = document.getElementById('weatherDisplay');
const locationInput = document.getElementById('locationInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const unitToggle = document.getElementById('unitToggle');

// weather icon maping object 
const weatherIconMapping = {
    '01d': 'cloudy.png',
    '01n': 'rainy.png',
    '02d': 'sunny.png',
    // ... Add more mappings for other weather conditions
};



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
        .catch(() => {
            showError('An error occurred while fetching weather data. Please try again.');
        });
}

function displayWeather(data, unit) {
    const { name, main, weather, wind } = data;
    const temperature = main.temp;
    const humidity = main.humidity;
    const description = weather[0].description;
    const windSpeed = wind.speed;
    const weatherIconCode = weather[0].icon;
    const weatherIconPath = `image/${weatherIconCode}.png`;

    weatherDisplay.innerHTML = `
        <h2>${name}</h2>
        <p>Temperature: ${temperature}°${unit === 'imperial' ? 'F' : 'C'}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Weather: ${description}</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
        <img src="${weatherIconPath}" alt="Weather Icon">
    `;
}

function showError(message) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
}
