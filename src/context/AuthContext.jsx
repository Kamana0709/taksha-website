import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('taksha_user');
    const token = localStorage.getItem('taksha_token');
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      // Backend can respond with a forced password-change flow instead of a session
      if (res.data.requirePasswordChange) {
        return {
          success: false,
          requirePasswordChange: true,
          tempToken: res.data.tempToken,
          email: res.data.email,
        };
      }

      const { token, user: userData } = res.data;

      setUser(userData);
      localStorage.setItem('taksha_user', JSON.stringify(userData));
      localStorage.setItem('taksha_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return { success: true, role: userData.role };
    } catch (err) {
      console.error('Login failed', err.response?.data?.error || err.message);
      return { success: false, error: err.response?.data?.error };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put(`${API_URL}/users/profile`, profileData);
      const updatedUser = res.data;

      setUser(updatedUser);
      localStorage.setItem('taksha_user', JSON.stringify(updatedUser));

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error('Update profile failed', err.response?.data?.error || err.message);
      return { success: false, error: err.response?.data?.error || 'Failed to update profile' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taksha_user');
    localStorage.removeItem('taksha_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};