import React, { useState } from 'react';
import AuthService from '../services/auth';
import './Login.css'; // 复用登录组件的样式

const Register = ({ onRegisterSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    // 验证密码
    if (password !== confirmPassword) {
      setMessage('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.register(username, email, password);
      setLoading(false);
      setMessage('注册成功！请登录');
      onRegisterSuccess && onRegisterSuccess();
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
      <form onSubmit={handleRegister}>
        <h2>注册</h2>
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
          <label htmlFor="email">邮箱</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </div>
        {message && (
          <div className={message.includes('成功') ? "alert alert-success" : "alert alert-danger"}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;