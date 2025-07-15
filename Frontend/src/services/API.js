class APIService {
  constructor() {
    this.baseURL = 'http://localhost:8080';
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async generatePosts({ username, rawPassword, topic, tone, length }) {
    const credentials = btoa(`${username}:${rawPassword}`);
    const body = { title: topic, tone };
    if (length) body.length = length;

    const response = await fetch(`${this.baseURL}/post/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to generate' }));
      throw new Error(error.message);
    }

    return response.json();
  }

  async previewPost({ username, rawPassword, comment, platforms }) {
    const credentials = btoa(`${username}:${rawPassword}`);
    const response = await fetch(`${this.baseURL}/post/preview`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ comment, platforms }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to preview' }));
      throw new Error(error.message);
    }

    return response.json(); // { tweetLink: ..., message: ... }
  }

  async savePost({ username, rawPassword, userId, comment, tone, platforms }) {
    const credentials = btoa(`${username}:${rawPassword}`);
    const response = await fetch(`${this.baseURL}/post/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, comment, tone, platforms }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to save post' }));
      throw new Error(error.message);
    }

    return response.json(); // { postId: ..., message: ... }
  }

  async sendPost({ username, rawPassword, userId, comment, tone, platforms }) {
    const credentials = btoa(`${username}:${rawPassword}`);

    const response = await fetch(`${this.baseURL}/post/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, comment, tone, platforms }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send' }));
      throw new Error(error.message);
    }

    return response.json();
  }
async postToTwitter({ comment }) {
  const accessToken = localStorage.getItem('twitter_access_token');
  if (!accessToken) {
    throw new Error('Twitter access token not found');
  }

  const response = await fetch(`${this.baseURL}/api/twitter/tweet`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`, // Ensure this is correct
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Failed to post to Twitter' }));
    throw new Error(error.message);
  }

  return response.json();
}


  getPlatforms() {
    return [
      { id: 'twitter', name: 'Twitter', icon: 'twitter', color: '#1DA1F2' },
      { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', color: '#0A66C2' },
      { id: 'facebook', name: 'Facebook', icon: 'facebook', color: '#1877F2' },
      { id: 'instagram', name: 'Instagram', icon: 'instagram', color: '#E4405F' },
    ];
  }

}

export const apiService = new APIService();
