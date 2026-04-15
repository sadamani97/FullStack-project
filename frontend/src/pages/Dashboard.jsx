import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../asset/logo.png"
import { getWeather } from "../services/weather";
import { useEffect, useState } from "react";
import profilePic from "../asset/profile.jpg";
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountries(data))
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  const viewCountry=(country) => {
    navigate(`/country/${country.name}`,{state:country});
  }
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>🌍 WeatherApp</h2>
        <ul>
          <li>Dashboard</li>
          <li>Profile</li>
        </ul>
        <div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
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
              <input type="text" placeholder="Search..." />
            </div>
            <div className="nav-right">
              <img src={profilePic} alt="profile" className="profile" />
            </div>
          </nav>

          <div className="ds-container">
            <h2>Countries</h2>
            <div className="country-grid">
              {countries.map((c) => (
                <div className="country-card" key={c.id} onClick={() => viewCountry(c)}>
                  
                  <img src={c.flag} alt={c.name} />
                  <div className="country-info">
                    <h3>{c.name}</h3>
                    <p>
                      <strong>Population:</strong>{" "}
                      {c.population.toLocaleString()}
                    </p>
                    <p>
                      <strong>Region:</strong> {c.region}
                    </p>
                    <p>
                      <strong>Capital:</strong> {c.capital}
                    </p>
                    
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
