import './App.css';
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';
import LoginPage from "./pages/LoginPage/LoginPage";
import ProductPage from './pages/ProductPage/ProductPage';
import SignUpPage from './pages/SignUpPage/SignUpPage';
import AddProductPage from './pages/AddProductPage/AddProductPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ListingPage from './pages/ListingPage/ListingPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthorizeProvider } from "./contexts/AuthorizeContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <div className="App">
      <AuthorizeProvider>
        <UserProvider>
          <ProductsProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Navigate to="/mainpage" />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/login" element={<LoginPage />} />       
                <Route path="/products/:id" element={<ProductPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path='/listingpage' element={<ListingPage />}/>
                <Route path='/user/:id' element={<UserProfilePage/>}/>
                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute>
                      <AddProductPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </HashRouter>
          </ProductsProvider>
        </UserProvider>
      </AuthorizeProvider>
    </div>
  );
}

export default App;