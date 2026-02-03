import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    // Check local storage on startup
    const savedUser = localStorage.getItem('savesmart_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('savesmart_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('savesmart_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}> 
      {/* ADDED setUser ABOVE */}
      {!loading && children}
    </AuthContext.Provider>
  );
};