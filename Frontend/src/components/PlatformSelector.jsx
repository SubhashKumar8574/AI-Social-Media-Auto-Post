import React from 'react';
import { Twitter, Linkedin, Facebook, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const iconMap = {
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
};

const PlatformSelector = ({ platforms, selectedPlatforms, onPlatformToggle }) => {
  const { colors } = useTheme();

  return (
    <div>
      <label className={`block text-sm font-medium ${colors.textMuted} mb-3`}>
        Select Platforms
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {platforms.map((platform) => {
          const IconComponent = iconMap[platform.icon];
          const isSelected = selectedPlatforms.includes(platform.id);

          return (
            <button
              key={platform.id}
              onClick={() => onPlatformToggle(platform.id)}
              className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${isSelected
                  ? `${colors.accent} ${colors.border} ${colors.text}`
                  : `${colors.input} ${colors.border} ${colors.textMuted} hover:${colors.buttonSecondary}`
                }`}
            >
              <div className={`flex-shrink-0 w-6 h-6 ${isSelected ? colors.text : colors.icon}`}>
                <IconComponent className="w-full h-full" />
              </div>
              <span className="font-medium text-sm">{platform.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;