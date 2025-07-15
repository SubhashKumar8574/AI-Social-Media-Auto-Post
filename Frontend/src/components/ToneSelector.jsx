import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const tones = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
  { value: 'humorous', label: 'Humorous', description: 'Light-hearted and funny' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
  { value: 'educational', label: 'Educational', description: 'Informative and teaching' },
  { value: 'promotional', label: 'Promotional', description: 'Marketing and sales-focused' },
];

const ToneSelector = ({ selectedTone, onToneChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();
  const selectedToneData = tones.find(tone => tone.value === selectedTone);

  return (
    <div className="relative">
      <label className={`block text-sm font-medium ${colors.textMuted} mb-2`}>
        Content Tone
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full ${colors.input} rounded-lg px-4 py-3 text-left ${colors.text} focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 flex items-center justify-between hover:${colors.buttonSecondary}`}
        >
          <div>
            <div className="font-medium">{selectedToneData?.label || 'Select a tone'}</div>
            {selectedToneData && (
              <div className={`text-sm ${colors.textSecondary}`}>{selectedToneData.description}</div>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 ${colors.icon} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className={`absolute z-10 w-full mt-2 ${colors.card} ${colors.border} rounded-lg shadow-xl`}>
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => {
                  onToneChange(tone.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 text-left hover:${colors.buttonSecondary} transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                  selectedTone === tone.value ? `${colors.accent} ${colors.text}` : colors.textMuted
                }`}
              >
                <div className="font-medium">{tone.label}</div>
                <div className={`text-sm ${colors.textSecondary}`}>{tone.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToneSelector;