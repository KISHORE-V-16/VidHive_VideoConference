import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = still checking

  useEffect(() => {
    const allKeys = Object.keys(localStorage);
    const customTokenKey = allKeys.find(key => key.startsWith('token_'));
    const tokenData = customTokenKey && JSON.parse(localStorage.getItem(customTokenKey));
    const authMethod = localStorage.getItem('authMethod');

    // Give access if logged in through custom backend
    if (tokenData && authMethod === 'custom') {
      setIsAuthorized(true);
    }

    // Give access if logged in through Firebase Google
    else if (authMethod === 'firebase') {
      // Wait for Firebase to initialize
      import('../Utils/firebase').then(({ fireAuth }) => {
        const unsubscribe = fireAuth.onAuthStateChanged(user => {
          if (user && user.emailVerified) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        });

        return () => unsubscribe();
      });
    }

    // Otherwise, not authorized
    else {
      setIsAuthorized(false);
    }
  }, []);

  if (isAuthorized === null) {
    return null; // or loading screen
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
