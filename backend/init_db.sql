-- 创建数据库
CREATE DATABASE IF NOT EXISTS todolist CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE todolist;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建待办事项表
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE,
    category VARCHAR(50) DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    owner_id INT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建索引
CREATE INDEX idx_todos_owner_id ON todos(owner_id);
CREATE INDEX idx_todos_title ON todos(title);
CREATE INDEX idx_todos_category ON todos(category);

-- 插入测试用户
INSERT INTO users (username, email, hashed_password, is_active)
VALUES ('testuser', 'test@example.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', TRUE);
-- 注意：上面的哈希密码对应的明文是'password'

-- 插入测试待办事项
INSERT INTO todos (title, description, category, owner_id)
VALUES ('完成项目', '完成待办事项应用的开发', '工作', 1);

INSERT INTO todos (title, description, category, completed, owner_id)
VALUES ('购物', '购买生活用品', '个人', FALSE, 1);

INSERT INTO todos (title, category, completed, owner_id)
VALUES ('阅读书籍', '学习', TRUE, 1);