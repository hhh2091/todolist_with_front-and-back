import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, toggleTodo, deleteTodo, updateTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTitle.trim()) {
      updateTodo(todo.id, { ...todo, title: editedTitle });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedTitle(todo.title);
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
          />
          <div className="edit-buttons">
            <button onClick={handleSave}>保存</button>
            <button onClick={handleCancel}>取消</button>
          </div>
        </div>
      ) : (
        <div className="view-mode">
          <div className="todo-content">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span className="todo-title">{todo.title}</span>
            <span className="todo-category">{todo.category}</span>
          </div>
          <div className="todo-actions">
            <button onClick={handleEdit}>编辑</button>
            <button onClick={() => deleteTodo(todo.id)}>删除</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;