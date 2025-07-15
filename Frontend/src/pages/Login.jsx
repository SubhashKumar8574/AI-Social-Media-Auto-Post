import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Home from './Home';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, user } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // navigation happens in useEffect
    } catch (err) {
      // toast handles error
    }
  };


  return (
    <div className="min-h-screen relative">
      {/* Background Home Component */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Home />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className={`${colors.card} rounded-2xl p-8 shadow-2xl`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.accent} rounded-full mb-4`}>
                <Sparkles className={`w-8 h-8 ${colors.icon}`} />
              </div>
              <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>Welcome Back</h1>
              <p className={colors.textSecondary}>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
                  Username
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.icon}`} />
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full ${colors.input} rounded-lg px-10 py-3 ${colors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your username"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
                  Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.icon}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full ${colors.input} rounded-lg px-10 py-3 pr-12 ${colors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${colors.icon} hover:text-yellow-300 transition-colors`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${colors.button} ${colors.text} font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                {isLoading ? <LoadingSpinner size="sm" text="Signing In..." /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={colors.textSecondary}>
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className={`${colors.textSecondary} hover:${colors.text} font-medium transition-colors`}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;