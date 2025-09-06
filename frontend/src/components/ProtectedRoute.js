import { Navigate } from "react-router-dom";
import { useAuthorize } from "../contexts/AuthorizeContext";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuthorize();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
}