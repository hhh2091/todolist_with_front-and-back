<template>
  <div class="home">
    <div class="user-controls">
      <span>欢迎, {{ currentUser?.username }}!</span>
      <button @click="logout" class="logout-btn">退出登录</button>
    </div>
    
    <h1>我的待办事项</h1>
    
    <!-- 添加待办事项表单 -->
    <div class="todo-form">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo" 
        placeholder="添加新的待办事项..."
        class="todo-input"
      />
      <button @click="addTodo" class="add-btn">添加</button>
    </div>
    
    <!-- 过滤器 -->
    <div class="filter-buttons">
      <button 
        @click="setFilter('all')" 
        :class="{ active: filter === 'all' }"
      >
        全部 ({{ todos.length }})
      </button>
      <button 
        @click="setFilter('active')" 
        :class="{ active: filter === 'active' }"
      >
        未完成 ({{ activeTodos.length }})
      </button>
      <button 
        @click="setFilter('completed')" 
        :class="{ active: filter === 'completed' }"
      >
        已完成 ({{ completedTodos.length }})
      </button>
    </div>
    
    <!-- 待办事项列表 -->
    <div class="todo-list">
      <div 
        v-for="todo in filteredTodos" 
        :key="todo.id" 
        class="todo-item"
        :class="{ completed: todo.completed }"
      >
        <input 
          type="checkbox" 
          :checked="todo.completed" 
          @change="toggleTodo(todo.id)"
          class="todo-checkbox"
        />
        <span 
          v-if="!todo.editing" 
          @dblclick="startEdit(todo)"
          class="todo-text"
        >
          {{ todo.text }}
        </span>
        <input 
          v-else
          v-model="todo.editText"
          @blur="finishEdit(todo)"
          @keyup.enter="finishEdit(todo)"
          @keyup.esc="cancelEdit(todo)"
          class="todo-edit-input"
          ref="editInput"
        />
        <button @click="deleteTodo(todo.id)" class="delete-btn">删除</button>
      </div>
    </div>
    
    <div v-if="todos.length === 0" class="empty-state">
      <p>还没有待办事项，添加一个开始吧！</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AuthService from '../services/auth'

export default {
  name: 'Home',
  data() {
    return {
      todos: [],
      newTodo: '',
      filter: 'all',
      currentUser: null
    }
  },
  computed: {
    activeTodos() {
      return this.todos.filter(todo => !todo.completed)
    },
    completedTodos() {
      return this.todos.filter(todo => todo.completed)
    },
    filteredTodos() {
      switch (this.filter) {
        case 'active':
          return this.activeTodos
        case 'completed':
          return this.completedTodos
        default:
          return this.todos
      }
    }
  },
  mounted() {
    this.currentUser = AuthService.getCurrentUser()
    this.fetchTodos()
  },
  methods: {
    async fetchTodos() {
      try {
        const response = await axios.get('http://localhost:8000/api/todos', {
          headers: AuthService.authHeader()
        })
        this.todos = response.data.map(todo => ({
          ...todo,
          editing: false,
          editText: todo.text
        }))
      } catch (error) {
        console.error('获取待办事项失败:', error)
      }
    },
    
    async addTodo() {
      if (!this.newTodo.trim()) return
      
      try {
        const response = await axios.post('http://localhost:8000/api/todos', {
          text: this.newTodo
        }, {
          headers: AuthService.authHeader()
        })
        
        this.todos.push({
          ...response.data,
          editing: false,
          editText: response.data.text
        })
        this.newTodo = ''
      } catch (error) {
        console.error('添加待办事项失败:', error)
      }
    },
    
    async toggleTodo(id) {
      try {
        const todo = this.todos.find(t => t.id === id)
        const response = await axios.put(`http://localhost:8000/api/todos/${id}`, {
          completed: !todo.completed
        }, {
          headers: AuthService.authHeader()
        })
        
        const index = this.todos.findIndex(t => t.id === id)
        this.todos[index] = {
          ...response.data,
          editing: false,
          editText: response.data.text
        }
      } catch (error) {
        console.error('更新待办事项失败:', error)
      }
    },
    
    async deleteTodo(id) {
      try {
        await axios.delete(`http://localhost:8000/api/todos/${id}`, {
          headers: AuthService.authHeader()
        })
        this.todos = this.todos.filter(todo => todo.id !== id)
      } catch (error) {
        console.error('删除待办事项失败:', error)
      }
    },
    
    startEdit(todo) {
      todo.editing = true
      todo.editText = todo.text
      this.$nextTick(() => {
        const input = this.$refs.editInput?.[0]
        if (input) input.focus()
      })
    },
    
    async finishEdit(todo) {
      if (!todo.editText.trim()) {
        this.cancelEdit(todo)
        return
      }
      
      try {
        const response = await axios.put(`http://localhost:8000/api/todos/${todo.id}`, {
          text: todo.editText
        }, {
          headers: AuthService.authHeader()
        })
        
        todo.text = response.data.text
        todo.editing = false
      } catch (error) {
        console.error('更新待办事项失败:', error)
        this.cancelEdit(todo)
      }
    },
    
    cancelEdit(todo) {
      todo.editing = false
      todo.editText = todo.text
    },
    
    setFilter(filter) {
      this.filter = filter
    },
    
    logout() {
      AuthService.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.user-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover {
  background-color: #c82333;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.todo-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.todo-input:focus {
  outline: none;
  border-color: #007bff;
}

.add-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-btn:hover {
  background-color: #0056b3;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-buttons button {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background-color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-buttons button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.filter-buttons button:hover {
  border-color: #007bff;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.todo-item:hover {
  background-color: #e9ecef;
}

.todo-item.completed {
  opacity: 0.7;
  background-color: #d4edda;
}

.todo-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.todo-text {
  flex: 1;
  text-align: left;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #6c757d;
}

.todo-edit-input {
  flex: 1;
  padding: 4px 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 14px;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.empty-state {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  margin-top: 40px;
}

@media (max-width: 768px) {
  .home {
    padding: 10px;
  }
  
  .todo-form {
    flex-direction: column;
  }
  
  .filter-buttons {
    flex-wrap: wrap;
  }
  
  .todo-item {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .todo-text {
    text-align: center;
  }
}
</style>