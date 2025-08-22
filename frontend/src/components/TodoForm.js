import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ addTodo }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTodo(title);
      setTitle('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加新的待办事项..."
      />
      <button type="submit">添加</button>
    </form>
  );
};

export default TodoForm;