import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Calendar, X } from 'lucide-react';

const UserDashboard = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { colors } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`${colors.card} rounded-2xl p-6 w-full max-w-md shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${colors.text}`}>User Profile</h2>
          <button
            onClick={onClose}
            className={`p-2 ${colors.buttonSecondary} rounded-lg transition-colors duration-200`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className={`w-20 h-20 ${colors.accent} rounded-full flex items-center justify-center`}>
              <User className={`w-10 h-10 ${colors.icon}`} />
            </div>
          </div>

          <div className={`p-4 ${colors.input} rounded-lg`}>
            <div className="flex items-center space-x-3 mb-2">
              <User className={`w-5 h-5 ${colors.icon}`} />
              <span className={`font-medium ${colors.textSecondary}`}>Email</span>
            </div>
            <p className={`${colors.text} ml-8`}>{user?.email || 'Not provided'}</p>
          </div>

          <div className={`p-4 ${colors.input} rounded-lg`}>
            <div className="flex items-center space-x-3 mb-2">
              <Mail className={`w-5 h-5 ${colors.icon}`} />
              <span className={`font-medium ${colors.textSecondary}`}>Username</span>
            </div>
            <p className={`${colors.text} ml-8`}>{user?.username || user?.email || 'Not provided'}</p>
          </div>

          <div className={`p-4 ${colors.input} rounded-lg`}>
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className={`w-5 h-5 ${colors.icon}`} />
              <span className={`font-medium ${colors.textSecondary}`}>Member Since</span>
            </div>
            <p className={`${colors.text} ml-8`}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently joined'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`w-full mt-6 bg-gradient-to-r ${colors.button} ${colors.text} font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;