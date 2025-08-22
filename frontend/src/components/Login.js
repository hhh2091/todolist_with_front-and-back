import React, { useState } from 'react';
import AuthService from '../services/auth';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const data = await AuthService.login(username, password);
      setLoading(false);
      if (data.access_token) {
        onLoginSuccess && onLoginSuccess();
      }
    } catch (error) {
      setLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.detail) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>登录</h2>
        <div className="form-group">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
        {message && <div className="alert alert-danger">{message}</div>}
      </form>
    </div>
  );
};

export default Login;