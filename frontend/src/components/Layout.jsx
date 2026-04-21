import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

const Layout = ({ children, search, setSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const { profilePic } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>🌍 WeatherApp</h2>
        <div className="sidebar-list">
          <p onClick={() => navigate("/dashboard")}>Countries</p>
          <p onClick={() => navigate("/weather")}>Weather</p>
          <p onClick={() => navigate("/profile")}>Profile</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="main">
        <nav className="navbar">
          <div className="nav-left">
            <img src={logo} alt="logo" className="logo-img" />
          </div>

          <div className="nav-center">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="nav-right">
            <div className="profile-container">
              <img
                src={profilePic || "https://i.pravatar.cc/150"}
                className="profile"
                onClick={() => setShowMenu(!showMenu)}
              />

              {showMenu && (
                <div className="profile-menu">
                  <p onClick={() => navigate("/profile")}>👤 Profile</p>
                  <p onClick={handleLogout}>🚪 Logout</p>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;