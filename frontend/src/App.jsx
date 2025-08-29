import './App.css';
import { useContext } from 'react';
import { AppContext  } from './AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProjectPage from './pages/ProjectPage';
import ProjectList from './pages/ProjectList';

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
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/user/projects" element={<ProjectList />} />
          <Route path="/project/:project_id" element={<ProjectPage />} />
        </Routes>
      </Router>
  );
}

export default App;
