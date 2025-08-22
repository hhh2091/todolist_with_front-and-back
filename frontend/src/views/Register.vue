<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>
      
      <form @submit.prevent="handleRegister">
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
          <label for="email">邮箱:</label>
          <input
            type="email"
            id="email"
            v-model="email"
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
        
        <div class="form-group">
          <label for="confirmPassword">确认密码:</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            :disabled="loading"
          />
        </div>
        
        <button type="submit" :disabled="loading" class="register-btn">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div v-if="message" :class="['alert', messageType === 'success' ? 'alert-success' : 'alert-error']">
        {{ message }}
      </div>
      
      <div class="auth-toggle">
        <p>已有账户？ <router-link to="/login">立即登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '../services/auth'

export default {
  name: 'Register',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      message: '',
      messageType: 'error'
    }
  },
  methods: {
    async handleRegister() {
      if (!this.username || !this.email || !this.password || !this.confirmPassword) {
        this.showMessage('请填写所有字段', 'error')
        return
      }
      
      if (this.password !== this.confirmPassword) {
        this.showMessage('密码和确认密码不匹配', 'error')
        return
      }
      
      if (this.password.length < 6) {
        this.showMessage('密码长度至少为6位', 'error')
        return
      }
      
      this.loading = true
      this.message = ''
      
      try {
        await AuthService.register(this.username, this.email, this.password)
        this.showMessage('注册成功！请登录', 'success')
        
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      } catch (error) {
        console.error('注册失败:', error)
        if (error.response?.status === 400) {
          this.showMessage('用户名或邮箱已存在', 'error')
        } else {
          this.showMessage('注册失败，请稍后重试', 'error')
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.register-form {
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
input[type="email"],
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
input[type="email"]:focus,
input[type="password"]:focus {
  outline: none;
  border-color: #007bff;
}

input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.register-btn:hover:not(:disabled) {
  background-color: #218838;
}

.register-btn:disabled {
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
  .register-form {
    padding: 30px 20px;
  }
  
  h2 {
    font-size: 24px;
  }
}
</style>