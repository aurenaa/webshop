import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage/MainPage';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/mainpage" element={<MainPage />}></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
