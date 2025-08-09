import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import './App.css';
import { useContext } from 'react';
import { AppContext  } from './AppContext';

function App() {
  const { loading } = useContext(AppContext);

  if (loading) {
    return <div className="loader_container"><div className="loader"></div></div>;
  }

  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </Router>
  );
}

export default App;
