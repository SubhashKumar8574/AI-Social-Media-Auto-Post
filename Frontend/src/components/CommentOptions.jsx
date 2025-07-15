import React, { useState } from 'react';
import { Check, Copy, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const CommentOptions = ({ posts, selectedPosts, onPostToggle, onPostEdit }) => {
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const { colors } = useTheme();

  const handleEditStart = (post) => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  const handleEditSave = (postId) => {
    onPostEdit(postId, editContent);
    setEditingPost(null);
    setEditContent('');
    toast.success('Post updated successfully!');
  };

  const handleEditCancel = () => {
    setEditingPost(null);
    setEditContent('');
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  return (
    <div>
      <label className={`block text-sm font-medium ${colors.textMuted} mb-3`}>
        Generated Content ({posts.length} posts)
      </label>
      <div className="space-y-4">
        {posts.map((post) => {
          const isSelected = selectedPosts.includes(post.id);
          const isEditing = editingPost === post.id;
          
          return (
            <div
              key={post.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? `${colors.accent} ${colors.border}`
                  : `${colors.input} ${colors.border}`
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <button
                  onClick={() => onPostToggle(post.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md transition-colors duration-200 ${
                    isSelected
                      ? `bg-gradient-to-r ${colors.button} ${colors.text}`
                      : `${colors.buttonSecondary}`
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(post.content)}
                    className={`p-2 ${colors.textMuted} hover:${colors.text} hover:${colors.buttonSecondary} rounded-md transition-colors duration-200`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditStart(post)}
                    className={`p-2 ${colors.textMuted} hover:${colors.text} hover:${colors.buttonSecondary} rounded-md transition-colors duration-200`}
                    title="Edit content"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`w-full ${colors.input} ${colors.border} rounded-lg px-3 py-2 ${colors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none`}
                    rows={4}
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditSave(post.id)}
                      className={`px-3 py-1 bg-gradient-to-r ${colors.button} ${colors.text} rounded-md transition-colors duration-200 text-sm`}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`${colors.textSecondary} whitespace-pre-wrap leading-relaxed`}>
                  {post.content}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs ${colors.textSecondary} ${colors.accent} px-2 py-1 rounded-full`}>
                  {post.tone} tone
                </span>
                <span className={`text-xs ${colors.textMuted}`}>
                  {post.content.length} characters
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentOptions;