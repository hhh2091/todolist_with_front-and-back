from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import todo, auth
from app.database.database import engine
from app.models import models

# 创建数据库表
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Todo List API")

# 配置CORS
origins = [
    "http://localhost:3000",  # React前端默认端口
    "http://localhost:5000",
    "*",  # 允许所有来源，生产环境中应该限制
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(todo.router, prefix="/api")
app.include_router(auth.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Todo List API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)