import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const { colors } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`${sizeClasses[size]} animate-spin ${colors.icon}`} />
      <span className={`${colors.textSecondary}`}>{text}</span>
    </div>
  );
};

export default LoadingSpinner;