// Connect HTML Elements
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");

const cityElement = document.querySelector(".city-name");
const tempElement = document.querySelector(".temperature");
const conditionElement = document.querySelector(".weather-condition");
const iconElement = document.querySelector(".weather-icon");
const humidityElement = document.querySelector(".humidity .value");
const windElement = document.querySelector(".wind .value");
const feelsLikeElement = document.querySelector(".feels .value");
const visibilityElement = document.querySelector(".visibility .value");
const sunriseElement = document.querySelector(".sunrise .value");
const sunsetElement = document.querySelector(".sunset .value");
const descriptionElement = document.querySelector(".description");

// 1. Search Button Click Event
searchButton.addEventListener("click", () => {
    handleSearch();
});

// 2. Keyboard "Enter" Key Event
cityInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeather(city);
    } else {
        alert("Please enter a city name!");
    }
}

// 3. Fetch Weather from Vercel Serverless Function (/api/weather)
async function getWeather(city) {
    try {
        cityElement.textContent = "Loading...";

        // Calls the secure backend proxy — API key remains hidden on Vercel
        const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.error || "City not found");
        }

        // Parse Weather Data
        const cityName = data.name;
        const tempCelsius = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const humidityData = data.main.humidity;
        const windSpeed = data.wind.speed;
        const visible = data.visibility;
        const condition = data.weather[0].main;
        const cityDescription = data.weather[0].description;
        const iconCode = data.weather[0].icon;

        const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        // Update UI
        cityElement.textContent = cityName;
        tempElement.textContent = `${tempCelsius}°C`;
        conditionElement.textContent = condition;
        humidityElement.textContent = `${humidityData}%`;
        windElement.textContent = `${windSpeed}km/h`;
        feelsLikeElement.textContent = `${feelsLike}°C`;
        visibilityElement.textContent = `${visible / 1000}km`;
        sunriseElement.textContent = sunriseTime;
        sunsetElement.textContent = sunsetTime;
        descriptionElement.textContent = cityDescription;

        // Display Weather Icon
        if (iconElement && iconCode) {
            iconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            iconElement.style.display = "block";
        }

    } catch (error) {
        alert(error.message);
        cityElement.textContent = "City Name";
        console.error("Weather Fetch Error:", error);
    }
}