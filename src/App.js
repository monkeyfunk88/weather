import React, { useState, useEffect } from "react"; // Import at the top level!
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
// ... other imports if you have them

const PLACES = [
    { name: "Palo Alto", zip: "94303" },
    { name: "San Jose", zip: "94088" },
    { name: "Santa Cruz", zip: "95062" },
    { name: "Honolulu", zip: "96803" },
];

function WeatherDisplay({ zip }) {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => { // useEffect is now correctly in scope
        const fetchWeatherData = async () => {
            const URL = `http://api.openweathermap.org/data/2.5/weather?q=${zip}&appid=b1b35bba8b434a28a0be2a3e1071ae5b&units=imperial`;
            try {
                const response = await fetch(URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const json = await response.json();
                setWeatherData(json);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setWeatherData({ error: "Could not fetch weather data." });
            }
        };

        fetchWeatherData();
    }, [zip]);

    if (!weatherData) return <div>Loading...</div>;

    if (weatherData.error) {
        return <div>{weatherData.error}</div>;
    }

    const weather = weatherData.weather[0];
    if (!weather || !weatherData.main || !weatherData.name || !weatherData.wind) {
        return <div>Error: Invalid weather data received.</div>;
    }
    const iconUrl = `http://openweathermap.org/img/w/${weather.icon}.png`;

    return (
        <div>
            <h1>
                {weather.main} in {weatherData.name}
                <img src={iconUrl} alt={weather.description} />
            </h1>
            <p>Current: {weatherData.main.temp}°</p>
            <p>High: {weatherData.main.temp_max}°</p>
            <p>Low: {weatherData.main.temp_min}°</p>
            <p>Wind Speed: {weatherData.wind.speed} mi/hr</p>
        </div>
    );
}

function App() {
    const [activePlace, setActivePlace] = useState(0);

    return (
        <div className="App">
            {PLACES.map((place, index) => (
                <button key={index} onClick={() => setActivePlace(index)}>
                    {place.name}
                </button>
            ))}
            <WeatherDisplay zip={PLACES[activePlace].zip} />
        </div>
    );
}

export default App;