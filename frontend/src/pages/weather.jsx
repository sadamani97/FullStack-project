import { useState, useEffect } from "react";
import { getWeather } from "../services/weather";
import API from "../services/api";
import Layout from "../components/Layout";

const Weather = () => {
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dbCountries, setDbCountries] = useState([]);
  const [fetchingData, setFetchingData] = useState(false);

  // Fetch user's saved weather from backend
  useEffect(() => {
    fetchWeatherFromBackend();
    fetchCountriesFromDB();
  }, []);

  const fetchWeatherFromBackend = async () => {
    try {
      setFetchingData(true);
      const res = await API.get("/api/weather");
      setCountries(res.data);
    } catch (error) {
      console.error("Error fetching weather from backend:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchCountriesFromDB = async () => {
    try {
      const res = await API.get("/api/countries");
      setDbCountries(res.data);
    } catch (error) {
      console.error("Error fetching countries from DB:", error);
    }
  };

  const handleAdd = async () => {
    if (!country) {
      alert("Please enter a country name");
      return;
    }
    setLoading(true);
    try {
      const weatherData = await getWeather(country);

      const newData = {
        name: country,
        temp: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
      };

      // Save to backend
      const res = await API.post("/api/weather", newData);
      setCountries((prev) => [...prev, res.data]);
      setCountry("");
    } catch (error) {
      alert("Invalid country name. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this weather entry?")) return;
    
    try {
      await API.delete(`/api/weather/${id}`);
      setCountries(countries.filter((c) => c.id !== id));
    } catch (error) {
      alert("Failed to delete weather entry");
      console.error(error);
    }
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new country name:");
    if (!newName) return;

    setLoading(true);
    try {
      const weatherData = await getWeather(newName);
      const updatedData = {
        name: newName,
        temp: weatherData.main.temp,
        condition: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        description: weatherData.weather[0].description,
        latitude: weatherData.coord.lat,
        longitude: weatherData.coord.lon,
      };

      // Update in backend
      const res = await API.put(`/api/weather/${id}`, updatedData);
      setCountries(countries.map((c) => (c.id === id ? res.data : c)));
    } catch (error) {
      alert("Invalid country name");
    } finally {
      setLoading(false);
    }
  };

  // Filter countries for search
  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout search={search} setSearch={setSearch}>
      <div className="weather-page-container">
        <h2>🌤️ Weather Details</h2>

        {/* ADD NEW WEATHER */}
        <div className="weather-input-section">
          <h3>Add Weather for a Country</h3>
          <div className="weather-upt">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter country name..."
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
            <button onClick={handleAdd} disabled={loading}>
              {loading ? "Loading..." : "Add"}
            </button>
          </div>
        </div>

        {/* WEATHER CARDS FROM BACKEND */}
        {filteredCountries.length > 0 && (
          <div className="weather-section">
            <h3>📍 Your Saved Weather ({filteredCountries.length})</h3>
            <div className="weather-card-container">
              {filteredCountries.map((c) => (
                <div className="weather-card" key={c.id}>
                  <div className="weather-card-header">
                    <h4>{c.name}</h4>
                    <span className="temp-badge">{Math.round(c.temp)}°C</span>
                  </div>

                  <div className="weather-card-body">
                    <p className="condition">
                      <strong>☁️ Condition:</strong> {c.condition}
                    </p>
                    {c.description && (
                      <p className="description">
                        <strong>📝 Description:</strong> {c.description}
                      </p>
                    )}
                    {c.humidity && (
                      <p>
                        <strong>💧 Humidity:</strong> {c.humidity}%
                      </p>
                    )}
                    {c.windSpeed && (
                      <p>
                        <strong>💨 Wind:</strong> {c.windSpeed.toFixed(2)} m/s
                      </p>
                    )}
                    {c.latitude && c.longitude && (
                      <p>
                        <strong>🗺️ Location:</strong> {c.latitude.toFixed(3)}, {c.longitude.toFixed(3)}
                      </p>
                    )}
                    <p className="weather-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="weather-card-footer">
                    <button
                      className="kbtn update-btn"
                      onClick={() => handleUpdate(c.id)}
                      disabled={loading}
                    >
                      Update
                    </button>
                    <button
                      className="kbtn delete-btn"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        
      </div>
    </Layout>
  );
};

export default Weather;



