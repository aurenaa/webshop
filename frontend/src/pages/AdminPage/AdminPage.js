import { useNavigate } from 'react-router-dom';
import { useAuthorize } from "../../contexts/AuthorizeContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./AdminPage.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useAuthorize();
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/mainpage');
  };

  return (
    <div className="admin-page d-flex">
      <div className="sidebar bg-light p-3 border-end">
        <h4 className="mb-4">Admin Panel</h4>
        <ul className="nav flex-column gap-2">
          <li 
            className="nav-item nav-link cursor-pointer"
            onClick={() => navigate("/admin/reviews")}
          >
            Manage Reviews
          </li>
          <li 
            className="nav-item nav-link cursor-pointer"
            onClick={() => navigate("/admin/reports")}
          >
            Manage Reports
          </li>
          <li 
            className="nav-item nav-link cursor-pointer"
            onClick={() => navigate("/admin/accounts")}
          >
            Manage Accounts
          </li>          
          <li 
            className="nav-item nav-link text-danger cursor-pointer mt-3"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </div>
  );
}
