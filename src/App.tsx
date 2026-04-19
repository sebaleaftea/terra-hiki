import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import GuildWar from './pages/GuildWar';
import Predictor from './pages/Predictor';
import Login from './pages/Login';

// Guard: redirect to /login if no token is present
function ProtectedRoute() {
  const token = localStorage.getItem('terra-token');
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* All protected routes live inside MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="home" element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="guildwar" element={<GuildWar />} />
            <Route path="predictor" element={<Predictor />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
