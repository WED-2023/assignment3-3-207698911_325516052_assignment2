<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Create Account</h1>
      <p class="subtitle">Join our community of food lovers</p>
    </div>
    
    <div class="form-container">
      <form @submit.prevent="register" class="register-form">
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
              placeholder="Choose a username"
            />
          </div>
          <div v-if="hasUsernameError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getUsernameErrorMessage }}
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
              placeholder="Create a password (6+ characters)"
            />
          </div>
          <div v-if="hasPasswordError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getPasswordErrorMessage }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-lock"></i>
            </div>
            <input 
              id="confirmPassword"
              v-model="state.confirmPassword" 
              type="password" 
              class="form-control" 
              placeholder="Confirm your password"
            />
          </div>
          <div v-if="hasConfirmPasswordError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getConfirmPasswordErrorMessage }}
          </div>
        </div>
        
        <button type="submit" class="submit-button">
          <i class="fas fa-user-plus"></i> Register
        </button>
        
        <div class="form-footer">
          <p>Already have an account? <router-link to="/login" class="link">Login</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, sameAs } from '@vuelidate/validators';

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      password: '',
      confirmPassword: '',
    });

    const rules = {
      username: { required },
      password: { required, minLength: minLength(6) },
      confirmPassword: { required, sameAsPassword: sameAs(() => state.password) }
    };

    const v$ = useVuelidate(rules, state);
    
    // Computed properties for username validation
    const hasUsernameError = computed(() => v$.value.username.$error);
    const getUsernameErrorMessage = computed(() => {
      if (v$.value.username.required.$invalid) {
        return 'Username is required.';
      }
      return '';
    });
    
    // Computed properties for password validation
    const hasPasswordError = computed(() => v$.value.password.$error);
    const getPasswordErrorMessage = computed(() => {
      if (v$.value.password.required.$invalid) {
        return 'Password is required.';
      }
      if (v$.value.password.minLength.$invalid) {
        return 'Password must be at least 6 characters.';
      }
      return '';
    });
    
    // Computed properties for confirm password validation
    const hasConfirmPasswordError = computed(() => v$.value.confirmPassword.$error);
    const getConfirmPasswordErrorMessage = computed(() => {
      if (v$.value.confirmPassword.required.$invalid) {
        return 'Confirm password is required.';
      }
      if (v$.value.confirmPassword.sameAsPassword && v$.value.confirmPassword.sameAsPassword.$invalid) {
        return 'Passwords must match.';
      }
      return '';
    });
    
    // Method to check if passwords match in real-time
    const checkPasswordsMatch = computed(() => {
      if (state.password && state.confirmPassword) {
        return state.password === state.confirmPassword;
      }
      return true; // Don't show mismatch if fields are empty
    });

    const register = async () => {
      if (await v$.value.$validate()) {
        try {
          await window.axios.post('/register', {
            username: state.username,
            password: state.password
          });
          window.toast("Registration Successful", "You can now login", "success");
          window.router.push('/login');
        } catch (err) {
          window.toast("Registration failed", err.response.data.message, "danger");
        }
      }
    };

    expose({ register });

    return { 
      state, 
      v$, 
      register,
      hasUsernameError,
      getUsernameErrorMessage,
      hasPasswordError,
      getPasswordErrorMessage,
      hasConfirmPasswordError,
      getConfirmPasswordErrorMessage,
      checkPasswordsMatch
    };
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

.register-form {
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
