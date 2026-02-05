import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on startup
    const savedUser = localStorage.getItem('savesmart_user');
    const token = localStorage.getItem('token'); // Check for the token too

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem('savesmart_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('savesmart_user', JSON.stringify(userData));
    // Save the token so your API calls can use it
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    // 1. Wipe state
    setUser(null);
    
    // 2. Wipe ALL sensitive storage
    localStorage.removeItem('savesmart_user');
    localStorage.removeItem('token');
    
    // 3. Optional: Clear session storage if you use it
    sessionStorage.clear();

    // 4. Hard redirect to clear any residual memory/state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}> 
      {!loading && children}
    </AuthContext.Provider>
  );
};