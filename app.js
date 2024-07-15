document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "hlRTudexcflE1hQbnXwQXLFGsUiIexm1";
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const currentWeatherIcon = document.getElementById("currentWeatherIcon");
    const currentTemp = document.getElementById("currentTemp");
    const currentCondition = document.getElementById("currentCondition");
    const hourlyForecastDiv = document.querySelector("#hourlyForecast .hourly-forecast");
    const dailyForecastDiv = document.querySelector("#dailyForecast .daily-forecast");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchCurrentWeather(locationKey);
                    fetchHourlyForecast(locationKey);
                    fetchDailyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchCurrentWeather(locationKey) {
        const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No current weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });
    }

    function displayCurrentWeather(weather) {
    const temperature = weather.Temperature.Metric.Value;
    const weatherText = weather.WeatherText;
    const icon = weather.WeatherIcon;
    const cityName = document.getElementById("cityInput").value; // Get the city name from input

    currentTemp.textContent = temperature;
    currentCondition.textContent = `${weatherText} in ${cityName}`;
    currentWeatherIcon.setAttribute("src", `https://www.accuweather.com/images/weathericons/${icon}.svg`);
    currentWeatherIcon.setAttribute("alt", weatherText);
}

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(hourlyForecastUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyForecastDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyForecastDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayHourlyForecast(forecast) {
        let hourlyForecastHTML = '';
        forecast.forEach(hour => {
            const dateTime = new Date(hour.DateTime);
            const temperature = hour.Temperature.Value;
            const weatherText = hour.IconPhrase;
            const icon = hour.WeatherIcon;

            hourlyForecastHTML += `
                <div class="hourly-entry">
                    <p>${dateTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })}</p>
                    <img src="https://www.accuweather.com/images/weathericons/${icon}.svg" alt="${weatherText}">
                    <p>${temperature}°C</p>
                    <p>${weatherText}</p>
                </div>
            `;
        });

        hourlyForecastDiv.innerHTML = hourlyForecastHTML;
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&metric=true`;

        fetch(dailyForecastUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    dailyForecastDiv.innerHTML = `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                dailyForecastDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayDailyForecast(forecasts) {
        let dailyForecastHTML = '';
        forecasts.forEach(day => {
            const date = new Date(day.Date);
            const maxTemp = day.Temperature.Maximum.Value;
            const minTemp = day.Temperature.Minimum.Value;
            const weatherText = day.Day.IconPhrase;
            const icon = day.Day.Icon;

            dailyForecastHTML += `
                <div class="daily-entry">
                    <div class="day-header">
                        <h3>${date.toLocaleDateString('en-US', { weekday: 'long' })}</h3>
                        <img src="https://www.accuweather.com/images/weathericons/${icon}.svg" alt="${weatherText}">
                    </div>
                    <div class="day-details">
                        <p>Max: ${maxTemp}°C</p>
                        <p>Min: ${minTemp}°C</p>
                        <p>${weatherText}</p>
                    </div>
                </div>
            `;
        });

        dailyForecastDiv.innerHTML = dailyForecastHTML;
    }
});
