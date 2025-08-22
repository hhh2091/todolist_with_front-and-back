# Todo List 应用

一个全栈待办事项应用，前端使用React，后端使用FastAPI。

author=bsf

## 项目结构

```
todolist/
├── frontend/         # React前端
│   ├── public/       # 静态资源
│   └── src/          # 源代码
│       ├── components/  # React组件
│       └── ...     
└── backend/          # FastAPI后端
    ├── app/          # 应用代码
    │   ├── core/     # 核心功能
    │   ├── database/ # 数据库配置
    │   ├── models/   # 数据模型
    │   ├── routes/   # API路由
    │   └── schemas/  # 数据验证模式
    ├── .env          # 环境变量
    ├── main.py       # 入口文件
    └── requirements.txt  # 依赖项
```

## 功能特性

- 用户注册和登录
- 创建、读取、更新和删除待办事项
- 按类别和完成状态筛选待办事项
- 响应式设计，适配移动设备

## 技术栈

### 前端

- React
- CSS
- Axios（用于API请求）

### 后端

- FastAPI
- SQLAlchemy（ORM）
- MySQL（数据库）
- JWT（认证）

## 安装和运行

### 前端

```bash
cd frontend
npm install
npm start
```

### 后端

1. 创建虚拟环境

```bash
cd backend
python -m venv venv
```

2. 激活虚拟环境

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. 安装依赖

```bash
pip install -r requirements.txt
```

4. 设置数据库

- 创建MySQL数据库
- 更新 `.env`文件中的数据库连接信息
- 运行 `init_db.sql`脚本初始化数据库

5. 启动服务器

```bash
uvicorn main:app --reload
```

## API文档

启动后端服务器后，访问以下URL查看API文档：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 测试账户

- 用户名: testuser
- 密码: password
