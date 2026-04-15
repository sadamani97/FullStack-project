import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWeather } from "../services/weather";

const CountryDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (state?.capital) {
      getWeather(state.capital)
        .then((res) => {
          setWeather(res);
        })
        .catch(() => console.log("Weather error"));
    }
  }, [state]);

  if (!state) return <h2>No Data</h2>;

  return (
    <div className="details-page">
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="details-container">
        
        {/* FLAG */}
        <div className="flag-section">
          <img src={state.flag} alt={state.name} />
        </div>

        {/* INFO */}
        <div className="info-section">
          <h2>{state.name}</h2>

          <p><strong>Population:</strong> {state.population.toLocaleString()}</p>
          <p><strong>Region:</strong> {state.region}</p>
          <p><strong>Capital:</strong> {state.capital}</p>

          {/* WEATHER */}
          {weather && (
            <div className="weather-box">
              <h3>Weather</h3>
              <p>🌡 Temp: {weather.main.temp}°C</p>
              <p>☁ Condition: {weather.weather[0].main}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;