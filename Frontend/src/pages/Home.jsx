import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/API';
import ToneSelector from '../components/ToneSelector';
import PlatformSelector from '../components/PlatformSelector';
import CommentOptions from '../components/CommentOptions';
import UserDashboard from '../components/UserDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import { LogOut, Sparkles, Send, User, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { openTweetPopup } from '../utils/openTweetPopup'; // adjust path as needed
import axios from 'axios';

const Home = () => {
  const location = useLocation();
  const [twitterConnected, setTwitterConnected] = useState(false);
  const { user, logout, token } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [topic, setTopic] = useState('');
  const [commentLength, setCommentLength] = useState('');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [postToSave, setPostToSave] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const platforms = apiService.getPlatforms();

    useEffect(() => {
    if (token) apiService.setToken(token);

    const twitterToken = localStorage.getItem('twitter_access_token');
    if (twitterToken) {
      setTwitterConnected(true);
    }
  }, [token]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (commentLength) {
      const length = parseInt(commentLength);
      if (isNaN(length) || length < 10 || length > 500) {
        toast.error('Length must be between 10 and 500 characters');
        return;
      }
    }

    setIsGenerating(true);

    try {
      const data = await apiService.generatePosts({
        username: user.username,
        rawPassword: user.rawPassword,
        topic,
        tone: selectedTone,
        length: commentLength ? parseInt(commentLength) : undefined,
      });

      const suggestions = data.suggestions.map((text, index) => ({
        id: `${index + 1}`,
        content: text,
        tone: selectedTone,
        platform: 'general',
      }));

      setGeneratedPosts(suggestions);
      setSelectedPosts([]);
      toast.success('Posts generated successfully!');
    } catch (err) {
      console.error('Generate error:', err);
      toast.error('Failed to generate posts. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePostToggle = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId) ? [] : [postId]
    );
  };

  const handlePostEdit = (postId, newContent) => {
    setGeneratedPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, content: newContent } : post
      )
    );
  };

const handleSend = async () => {
  if (selectedPosts.length === 0) {
    toast.error('Please select at least one post');
    return;
  }

  if (selectedPlatforms.length === 0) {
    toast.error('Please select at least one platform');
    return;
  }

  setIsSending(true);

  try {
    const selectedPost = generatedPosts.find(
      (post) => post.id === selectedPosts[0]
    );

    if (selectedPlatforms.includes('twitter')) {
      // Post to Twitter directly using access token
      await apiService.postToTwitter({ comment: selectedPost.content });
    }

    // Save post to DB
    await apiService.savePost({
      username: user.username,
      rawPassword: user.rawPassword,
      userId: user.id || user._id,
      comment: selectedPost.content,
      tone: selectedPost.tone,
      platforms: selectedPlatforms,
    });

    toast.success('Post published successfully!');
    setTopic('');
    setCommentLength('');
    setSelectedTone('professional');
    setSelectedPlatforms([]);
    setGeneratedPosts([]);
    setSelectedPosts([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (error) {
    console.error('Send error:', error);
    toast.error(error.message || 'Failed to post.');
  } finally {
    setIsSending(false);
  }
};

  const confirmPostSave = async () => {
    if (!postToSave) return;

    try {
      await apiService.savePost({
        username: user.username,
        rawPassword: user.rawPassword,
        userId: user.id || user._id,
        comment: postToSave.comment,
        tone: postToSave.tone,
        platforms: postToSave.platforms,
      });

      toast.success('Post saved successfully!');

      setTopic('');
      setCommentLength('');
      setSelectedTone('professional');
      setSelectedPlatforms([]);
      setGeneratedPosts([]);
      setSelectedPosts([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error('Failed to save post.');
    } finally {
      setShowConfirmModal(false);
      setPostToSave(null);
    }
  };

const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};


const handleTwitterLogin = async () => {
  try {
    const clientId = 'N1AxYlRZYXBUMWJaX3I3QUpQbnE6MTpjaQ'; // ✅ Replace with your real client ID
    const redirectUri = 'http://localhost:5173/twitter-success';

    const verifier = generateCodeVerifier();
    const challenge = await sha256(verifier);

    localStorage.setItem('code_verifier', verifier);

    // Here, add the correct scopes for Twitter API access
    const params = new URLSearchParams({
      response_type: 'code',               // Authorization code flow
      client_id: clientId,                  // Your Twitter Client ID
      redirect_uri: redirectUri,            // Your redirect URI for Twitter callback
      scope: 'tweet.write users.read offline.access',  // Required Twitter API permissions
      state: 'state123',                    // Unique state parameter to prevent CSRF
      code_challenge: challenge,            // Code challenge generated during the OAuth flow
      code_challenge_method: 'S256',        // Code challenge method used for OAuth 2.0 PKCE
    });

    const authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

    openTweetPopup(authUrl, () => {
      const token = localStorage.getItem('twitter_access_token');
      if (token) {
        setTwitterConnected(true);
        toast.success('Twitter connected!');
      }
    });
  } catch (error) {
    console.error('Twitter login error:', error);
    toast.error('Twitter auth failed');
  }
};



  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.primary}`}>
      <div className="absolute inset-0 bg-black/20"></div>
      <header className={`relative z-10 ${colors.card} border-b ${colors.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 ${colors.accent} rounded-lg`}>
                <Sparkles className={`w-6 h-6 ${colors.icon}`} />
              </div>
              <h1 className={`text-xl font-bold ${colors.text}`}>AI-Auto-Post</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 ${colors.buttonSecondary} rounded-lg transition-colors duration-200`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {/* ✅ Twitter Connect Button in Navbar */}
              <button
                onClick={handleTwitterLogin}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                {twitterConnected ? 'Connected to Twitter' : 'Connect Twitter'}
              </button>
              <button
                onClick={() => setShowUserDashboard(true)}
                className={`flex items-center space-x-2 p-2 ${colors.buttonSecondary} rounded-lg transition-colors duration-200`}
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.name}</span>
              </button>
              <button
                onClick={logout}
                className={`flex items-center space-x-2 px-3 py-2 ${colors.buttonSecondary} rounded-lg transition-colors duration-200`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${colors.card} rounded-2xl p-6 shadow-2xl`}>
          <div className="space-y-6">
            <div>
              <label htmlFor="topic" className={`block text-sm font-medium ${colors.textMuted} mb-2`}>
                What topic would you like to create content about?
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className={`w-full ${colors.input} rounded-lg px-4 py-3 ${colors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200`}
                placeholder="e.g., Artificial Intelligence, Digital Marketing, Leadership..."
              />
            </div>

            <div>
              <label htmlFor="length" className={`block text-sm font-medium ${colors.textMuted} mb-2`}>
                Desired comment length (optional)
              </label>
              <input
                type="number"
                id="length"
                value={commentLength}
                onChange={(e) => setCommentLength(e.target.value)}
                className={`w-full ${colors.input} rounded-lg px-4 py-3 ${colors.text} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200`}
                placeholder="Enter length (10–500)"
                min="10"
                max="500"
              />
            </div>

            <ToneSelector selectedTone={selectedTone} onToneChange={setSelectedTone} />

            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className={`w-full bg-gradient-to-r ${colors.button} ${colors.text} font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2`}
            >
              {isGenerating ? (
                <LoadingSpinner size="sm" text="Generating Content..." />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Content</span>
                </>
              )}
            </button>

            {generatedPosts.length > 0 && (
              <CommentOptions
                posts={generatedPosts}
                selectedPosts={selectedPosts}
                onPostToggle={handlePostToggle}
                onPostEdit={handlePostEdit}
              />
            )}

            {generatedPosts.length > 0 && (
              <PlatformSelector
                platforms={platforms}
                selectedPlatforms={selectedPlatforms}
                onPlatformToggle={handlePlatformToggle}
              />
            )}

            {generatedPosts.length > 0 && (
              <>
                <button
                  onClick={handleSend}
                  disabled={isSending || selectedPosts.length === 0 || selectedPlatforms.length === 0}
                  className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2`}
                >
                  {isSending ? (
                    <LoadingSpinner size="sm" text="Sending Posts..." />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Post to Selected Platforms</span>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <UserDashboard isOpen={showUserDashboard} onClose={() => setShowUserDashboard(false)} />
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-80 text-center shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Did you post on Twitter?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmPostSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Yes, Save
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPostToSave(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
