import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppRoutes from "./router/Routes";
import { useSession } from "./hooks/useSession";
import SessionExpiredModal from "./components/SessionExpiredModal";

const App = () => {
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useSession({ intervalMs: 30000 });

  useEffect(() => {
    const handleSessionExpired = () => {
      // 🚀 Solo activar si NO estoy en /login
      if (location.pathname !== '/login') {
        setSessionExpired(true);
      }
    };

    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [location.pathname]);

  const handleCloseSessionModal = () => {
    setSessionExpired(false);
    navigate('/login');
  };

  return (
    <>
      <AppRoutes />
      <SessionExpiredModal
        isOpen={sessionExpired}
        onConfirm={handleCloseSessionModal}
      />
    </>
  );
};

export default App;
