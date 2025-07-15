import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    try {
      if (savedToken && savedUser && savedUser !== 'undefined') {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      // ✅ Store user with rawPassword
      const userWithPassword = { ...data.user, rawPassword: password };

      setToken(data.token); // optional, for future if needed
      setUser(userWithPassword);

      localStorage.setItem('user', JSON.stringify(userWithPassword));
      localStorage.setItem('token', data.token); // optional

      toast.success('Successfully logged in!');
    } catch (error) {
      toast.error('Wrong credentials. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };



  const signup = async (username, email, password) => {
  setIsLoading(true);
  try {
    const response = await fetch('http://localhost:8080/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    // Optional: show toast here
    toast.success('Account created successfully! Please login.');

    // ⛔️ DO NOT set token or user here
  } catch (error) {
    toast.error('Account creation failed. Please try again.');
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Successfully logged out!');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
