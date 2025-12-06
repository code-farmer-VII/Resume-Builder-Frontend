import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeHistory } from './page/ResumeHistory';
import { ResumeBuilder } from './page/ResumeBuilder';
import { Auth } from './page/Auth';
import { Home } from './page/Home';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Auth />} />
        <Route path="/auth" element={user ? <Navigate to="/home" /> : <Auth />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/auth" />} />
        <Route path="/builder" element={user ? <ResumeBuilder /> : <Navigate to="/auth" />} />
        <Route path="/history" element={user ? <ResumeHistory /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
