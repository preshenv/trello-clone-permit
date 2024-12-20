<template>
  <div class="auth-container">
    <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div v-if="!isLogin" class="form-group">
        <input type="text" v-model="name" placeholder="Name" required />
      </div>
      <div class="form-group">
        <input type="text" v-model="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <input type="password" v-model="password" placeholder="Password" required />
      </div>
      <div class="form-group">
        <input v-if="!isLogin" type="password" v-model="confirmPassword" placeholder="Confirm Password" required />
      </div>
      <button type="submit">{{ isLogin ? 'Login' : 'Register' }}</button>
    </form>
    <p>
      {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
      <a href="#" @click.prevent="toggleAuth">
        {{ isLogin ? 'Register' : 'Login' }}
      </a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      isLogin: true,
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    toggleAuth() {
      this.isLogin = !this.isLogin
    },
    handleSubmit() {
      if (this.isLogin) {
        // Handle login
        fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: this.email, password: this.password })
        }).then(response => response.json())
          .then(data => {
            //set token to local storage
            localStorage.setItem('token', data.token)
            this.$router.push('/boards')
          })
          .catch(error => console.error('Error:', error))
      } else {
        if (this.password !== this.confirmPassword) {
          alert('Passwords do not match')
          return
        }
        // Handle register
        fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: this.name, email: this.email, password: this.password, confirmPassword: this.confirmPassword })
        })
          .then(response => response.json())
          .then(data => {
            //set token to local storage
            localStorage.setItem('token', data.token)
            this.$router.push('/boards')
          })
          .catch(error => console.error('Error:', error))
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

a {
  color: #4CAF50;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
