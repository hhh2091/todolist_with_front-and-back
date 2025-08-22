import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const AuthService = {
  login: async (username, password) => {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [(data) => {
        const formData = new URLSearchParams();
        for (const key in data) {
          formData.append(key, data[key]);
        }
        return formData.toString();
      }]
    });
    if (response.data.access_token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  register: async (username, email, password) => {
    return await axios.post(`${API_URL}/register`, {
      username,
      email,
      password
    });
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  authHeader: () => {
    const user = AuthService.getCurrentUser();
    if (user && user.access_token) {
      return { Authorization: `Bearer ${user.access_token}` };
    } else {
      return {};
    }
  }
};

export default AuthService;