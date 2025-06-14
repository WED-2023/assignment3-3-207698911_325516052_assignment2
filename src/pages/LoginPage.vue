<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Welcome Back</h1>
      <p class="subtitle">Sign in to access your favorite recipes</p>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-user"></i>
            </div>
            <input 
              id="username"
              v-model="state.username" 
              type="text" 
              class="form-control" 
              placeholder="Enter your username"
            />
          </div>
          <div v-if="v$.username.$error" class="error-message">
            <i class="fas fa-exclamation-circle"></i> Username is required.
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-lock"></i>
            </div>
            <input 
              id="password"
              v-model="state.password" 
              type="password" 
              class="form-control" 
              placeholder="Enter your password"
            />
          </div>
          <div v-if="v$.password.$error" class="error-message">
            <i class="fas fa-exclamation-circle"></i> Password is required (at least 6 characters).
          </div>
        </div>
        
        <button type="submit" class="submit-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </button>
        
        <div class="form-footer">
          <p>Don't have an account? <router-link to="/register" class="link">Register</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';

export default {
  name: "LoginPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
    };

    const v$ = useVuelidate(rules, state);

    const login = async () => {
      if (await v$.value.$validate()) {
        // קריאה לשרת
        try {
          await window.axios.post('/login', {
            username: state.username,
            password: state.password
          });
          window.store.login(state.username);
          window.router.push('/main');
        } catch (err) {
          window.toast("Login failed", err.response.data.message, "danger");
        }
      }
    };

    expose({ login });

    return { state, v$, login };
  }
};
</script>

<style scoped>
/* Font import for better typography */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
/* Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Poppins', sans-serif;
  color: #333;
}

/* Header Styling */
.header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-top: 0;
}

/* Form Styling */
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
}

.login-form {
  width: 100%;
  max-width: 500px;
  background-color: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #999;
}

.form-control {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-control:focus {
  border-color: #1a73e8;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
  outline: none;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 8px;
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
}

.submit-button:hover {
  background-color: #0d62c9;
}

.form-footer {
  text-align: center;
  margin-top: 25px;
  color: #666;
}

.link {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.link:hover {
  color: #0d62c9;
  text-decoration: underline;
}
</style>
