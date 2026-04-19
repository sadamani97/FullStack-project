import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import logo from "../asset/logo.png";
import { useEffect, useState } from "react";
import profilePic from "../asset/profile.jpg";
import { Label } from "recharts";



const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [region, setRegion] = useState("");
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(profilePic);

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
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
      const imageUrl =URL.createObjectURL(file);
      setProfile(imageUrl);
    }
  };

  const viewCountry = (country) => {
    navigate(`/country/${country.name}`, { state: country });
  };

  const filteredCountries = countries.filter((c) => {
    return(
      (region === "" || c.region === region) &&
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  });
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>🌍 WeatherApp</h2>
        <ul>
          <li onClick={() => navigate("/Dashboard")}>Countries</li>
          <li onClick={() => navigate("/weather")}>Weather</li>
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
              <input type="text" placeholder="Search..." value={search} 
              onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="nav-right">

              <div className="profile-container">
                <img src={profile} alt="profile"
                className="profile"
                onClick={() => setShowMenu(!showMenu)}/>
                {showMenu && (
                  <div className="profile-menu">
                    <p onClick={() => alert("setting clicked")}>⚙️ Settings</p>
                    <Label className="upload-btn">📷 Upload Photo
                      <input type="file" onChange={handleImageUpload} hidden />
                    </Label>
                    <p onClick={handleLogout}> 🚪 Logout</p>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <div className="ds-container">
            <h2>Countries</h2>
            <div className="filter-bar">

              {/* DropDown */}
              <select value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="" >Filter by Region</option>
                <option value="Europe">Europe</option>
                <option value="Americas" >Americas</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
              </select>
            </div>
            <div className="country-grid">
              {filteredCountries.map((c) => (
                <div
                  className="country-card"
                  key={c.id}
                  onClick={() => viewCountry(c)}
                >
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
