async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    if (city === "") {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    errorMessage.textContent = "";

    try {

        // Find city coordinates
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            errorMessage.textContent = "City not found.";
            return;
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display city
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        // Display temperature
        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        // Display humidity
        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        // Display wind
        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        // Weather condition
        const weatherInfo = getWeatherCondition(current.weather_code);

        document.getElementById("condition").textContent =
            weatherInfo.text;

        document.getElementById("weatherIcon").textContent =
            weatherInfo.icon;

    } catch (error) {

        console.error(error);
        errorMessage.textContent =
            "Unable to get weather data. Please try again.";

    }
}


function getWeatherCondition(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2 || code === 3) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 45 || code === 48) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 67) {
        return {
            text: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌤️"
    };
}


// Press Enter to search
document.getElementById("cityInput").addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});