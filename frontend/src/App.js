import React, { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import TodoFilter from './components/TodoFilter';
import Login from './components/Login';
import Register from './components/Register';
import axios from 'axios';
import AuthService from './services/auth';

function App() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const API_URL = 'http://localhost:8000/api';
  
  // 检查用户是否已登录
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user && user.access_token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, filter]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos/`, { headers: AuthService.authHeader() });
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (title) => {
    try {
      const response = await axios.post(`${API_URL}/todos/`, {
        title,
        completed: false,
        category: 'general'
      }, { headers: AuthService.authHeader() });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find(todo => todo.id === id);
    try {
      const response = await axios.put(`${API_URL}/todos/${id}/`, {
        ...todoToToggle,
        completed: !todoToToggle.completed
      }, { headers: AuthService.authHeader() });
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}/`, { headers: AuthService.authHeader() });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}/`, updatedTodo, { headers: AuthService.authHeader() });
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const filterTodos = () => {
    switch (filter) {
      case 'completed':
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case 'active':
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      default:
        setFilteredTodos(todos);
        break;
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    fetchTodos(); // 登录成功后获取待办事项
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setTodos([]);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const toggleRegisterLogin = () => {
    setShowRegister(!showRegister);
  };

  return (
    <div className="app">
      <h1>待办事项清单</h1>
      {isLoggedIn ? (
        <>
          <div className="user-controls">
            <button className="logout-btn" onClick={handleLogout}>退出登录</button>
          </div>
          <TodoForm addTodo={addTodo} />
          <TodoFilter filter={filter} setFilter={setFilter} />
          <TodoList 
            todos={filteredTodos} 
            toggleTodo={toggleTodo} 
            deleteTodo={deleteTodo}
            updateTodo={updateTodo}
          />
        </>
      ) : (
        <>
          {showRegister ? (
            <>
              <Register onRegisterSuccess={handleRegisterSuccess} />
              <div className="auth-toggle">
                已有账号？<button onClick={toggleRegisterLogin}>去登录</button>
              </div>
            </>
          ) : (
            <>
              <Login onLoginSuccess={handleLoginSuccess} />
              <div className="auth-toggle">
                没有账号？<button onClick={toggleRegisterLogin}>去注册</button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;