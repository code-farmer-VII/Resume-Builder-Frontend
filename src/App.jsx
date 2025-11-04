import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResumeHistory } from './page/ResumeHistory';
import { ResumeBuilder } from './page/ResumeBuilder';
import { Auth } from './page/Auth';
import { useAuth } from './context/AuthContext';
import { LoadingAnimation } from './components/LoadingAnimation';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingAnimation />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/builder" /> : <Auth />} />
        <Route path="/auth" element={user ? <Navigate to="/builder" /> : <Auth />} />
        <Route path="/builder" element={user ? <ResumeBuilder /> : <Navigate to="/auth" />} />
        <Route path="/history" element={user ? <ResumeHistory /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
