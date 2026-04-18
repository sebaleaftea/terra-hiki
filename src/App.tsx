import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import GuildWar from './pages/GuildWar';
import Predictor from './pages/Predictor';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="guildwar" element={<GuildWar />} />
          <Route path="predictor" element={<Predictor />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
