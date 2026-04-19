import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { getWeather } from "../services/weather";
import profilePic from "../asset/profile.jpg";
import logo from "../asset/logo.png";
import { useState } from "react";
const Weather = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");

  const handleAdd = async () => {
    if (!country) return;
    try {
      const weather = await getWeather(country);

      console.log("weather:", weather);
      const newData = {
        id: Date.now(),
        name: country,
        temp: weather.main.temp,
        condition: weather.weather[0].main,
      };
      setCountries((prev) => [...prev, newData]);
      setCountry("");
    } catch (error) {
      alert("Invalid country name");
    }
  };

  const handleDelete = (id) => {
    setCountries(countries.filter((c) => c.id !== id));
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new country name:");
    if (!newName) return;

    try {
      const weather = await getWeather(newName);
      const updated = countries.map((c) =>
        c.id === id
          ? {
              ...c,
              name: newName,
              temp: weather.main.temp,
              condition: weather.weather[0].main,
            }
          : c,
      );
      setCountries(updated);
    } catch (error) {
      alert("Invalid country name");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="layout" >
      <aside className="sidebar">
        <h2>🌍 WeatherApp</h2>
        <ul>
          <li onClick={() => navigate("/Dashboard")}>Countries</li>
          <li onClick={() => navigate("/weather")}>Weather</li>         
        </ul>
        <div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        
      </aside>

      {/* main section */}
      <div className="main">
        <div>
          <nav className="navbar">
            <div className="nav-left">
                          <img src={logo} alt="logo" className="logo-img" />
                        </div>
                        <div className="nav-center">
                          {" "}
                          <input type="text" placeholder="Search..." value={search} 
                          onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="nav-right">
                          <img src={profilePic} alt="profile" className="profile" />
                        </div>
          </nav>

          <div className="ds-container">
            <h2>Weather</h2>
            <div className="weather-upt">
            <input
              type="text"
              placeholder="Enter country name"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <button onClick={handleAdd}>Add Country</button>
            </div>

            {/* country list */}
            <div className="card-container">
              {countries.map((c) => (
                <div className="card" key={c.id}>
                  {c.name} | {c.temp}°C | {c.condition}
                  <button className="kbtn" onClick={() => handleUpdate(c.id)}>
                    Update
                  </button>
                  <button className="kbtn" onClick={() => handleDelete(c.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
