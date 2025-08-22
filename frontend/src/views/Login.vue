<template>
  <div class="login-container">
    <div class="login-form">
      <h2>登录</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            :disabled="loading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            :disabled="loading"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-error']">
        {{ message }}
      </div>
      
      <div class="auth-toggle">
        <p>还没有账户？ <router-link to="/register">立即注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
      message: '',
      messageType: 'error'
    }
  },
  methods: {
    async handleLogin() {
      if (!this.username || !this.password) {
        this.showMessage('请填写所有字段', 'error')
        return
      }
      
      this.loading = true
      this.message = ''
      
      try {
        await AuthService.login(this.username, this.password)
        this.showMessage('登录成功！', 'success')
        
        setTimeout(() => {
          this.$router.push('/')
        }, 1000)
      } catch (error) {
        console.error('登录失败:', error)
        if (error.response?.status === 401) {
          this.showMessage('用户名或密码错误', 'error')
        } else {
          this.showMessage('登录失败，请稍后重试', 'error')
        }
      } finally {
        this.loading = false
      }
    },
    
    showMessage(text, type) {
      this.message = text
      this.messageType = type
      
      if (type === 'error') {
        setTimeout(() => {
          this.message = ''
        }, 5000)
      }
    }
  },
  
  mounted() {
    // 如果已经登录，重定向到首页
    if (AuthService.getCurrentUser()) {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-weight: 500;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #007bff;
}

input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.alert {
  padding: 12px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
  font-weight: 500;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.auth-toggle {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.auth-toggle p {
  color: #666;
  margin: 0;
}

.auth-toggle a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.auth-toggle a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-form {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 24px;
  }
}
</style>