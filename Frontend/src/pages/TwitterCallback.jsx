import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const TwitterCallback = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false); // ✅ Fix: persist across re-renders

  useEffect(() => {
    const handleAuth = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      const token = localStorage.getItem('twitter_access_token');
      if (token) {
        toast.success('Twitter connected successfully!');
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const verifier = localStorage.getItem('code_verifier');

      if (!code || !verifier) {
        toast.error('Missing code or verifier');
        return navigate('/');
      }

      try {
        const res = await axios.post('http://localhost:8080/api/twitter/exchange-token', {
          code,
          verifier,
        });

        const accessToken = res.data.accessToken;
        if (accessToken) {
          localStorage.setItem('twitter_access_token', accessToken);
          toast.success('Twitter connected successfully!');
          navigate('/');
        } else {
          throw new Error('No access token received');
        }
      } catch (err) {
        console.error('Twitter token exchange failed:', err);
        toast.error('Twitter authorization failed');
        navigate('/');
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="p-6 text-center text-gray-800 dark:text-white">
      Connecting to Twitter...
    </div>
  );
};

export default TwitterCallback;
