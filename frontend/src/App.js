import './App.css';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthorizeProvider } from "./contexts/AuthorizeContext";

function App() {
  return (
    <div className="App">
      <AuthorizeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/mainpage" />} />
            <Route path="/mainpage" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />          
          </Routes>
        </HashRouter>
      </AuthorizeProvider>
    </div>
  );
}

export default App;
