import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white border-b px-6 py-3 flex justify-between items-center shadow-sm">

      <div className="flex gap-5 text-sm font-medium text-gray-700">
        <Link to="/dashboard" className="hover:text-blue-600">Tasks</Link>
        {isAdmin && (
          <Link to="/admin" className="hover:text-blue-600">Admin</Link>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="text-gray-600 hover:text-red-500 transition"
        title="Logout"
      >
        <FiLogOut size={18} />
      </button>

    </nav>
  );
};

export default Navbar;