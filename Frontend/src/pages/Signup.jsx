import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import Home from './Home';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signup(username, email, password);
      navigate('/login'); // ✅ Redirect to login after successful signup
    } catch (err) {
      // Toast is handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <Home />
      </div>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className={`${colors.card} rounded-2xl p-8 shadow-2xl`}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${colors.accent} rounded-full mb-4`}>
                <Sparkles className={`w-8 h-8 ${colors.icon}`} />
              </div>
              <h1 className={`text-3xl font-bold ${colors.text} mb-2`}>Create Account</h1>
              <p className={colors.textSecondary}>Join us and start creating amazing content</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.icon}`} />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${colors.input} rounded-lg px-10 py-3 ${colors.text} placeholder-gray-400`}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                    className={`w-full ${colors.input} rounded-lg px-10 py-3 ${colors.text}`}
                    placeholder="Choose a username"
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
                    className={`w-full ${colors.input} rounded-lg px-10 py-3 pr-12 ${colors.text}`}
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${colors.textSecondary} mb-2`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${colors.icon}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full ${colors.input} rounded-lg px-10 py-3 pr-12 ${colors.text}`}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && <div className={`${colors.error} rounded-lg p-3 text-sm`}>{error}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r ${colors.button} ${colors.text} font-semibold py-3 px-4 rounded-lg`}
              >
                {isLoading ? <LoadingSpinner size="sm" text="Creating Account..." /> : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className={colors.textSecondary}>
                Already have an account?{' '}
                <Link to="/login" className={`${colors.textSecondary} hover:${colors.text} font-medium`}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
