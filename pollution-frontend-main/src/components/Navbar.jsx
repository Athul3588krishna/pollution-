import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  if (!token) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-brand">Pollution Tracker</div>
      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/health">Health Profile</NavLink>
      </div>
      <div className="nav-user">
        <span>{user?.name || "User"}</span>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
