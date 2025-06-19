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
              placeholder="Choose a username (3-8 letters)"
            />
          </div>
          <div v-if="hasUsernameError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getUsernameErrorMessage }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="firstName">First Name</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-user-tag"></i>
            </div>
            <input 
              id="firstName"
              v-model="state.firstName" 
              type="text" 
              class="form-control" 
              placeholder="Enter your first name"
            />
          </div>
          <div v-if="hasFirstNameError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getFirstNameErrorMessage }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="lastName">Last Name</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-user-tag"></i>
            </div>
            <input 
              id="lastName"
              v-model="state.lastName" 
              type="text" 
              class="form-control" 
              placeholder="Enter your last name"
            />
          </div>
          <div v-if="hasLastNameError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getLastNameErrorMessage }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <input 
              id="email"
              v-model="state.email" 
              type="email" 
              class="form-control" 
              placeholder="Enter your email address"
            />
          </div>
          <div v-if="hasEmailError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getEmailErrorMessage }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="country">Country</label>
          <div class="input-container">
            <div class="input-icon">
              <i class="fas fa-globe"></i>
            </div>
            <select 
              id="country"
              v-model="state.country" 
              class="form-control" 
              :disabled="isLoadingCountries"
            >
              <option value="" disabled>Select your country</option>
              <option v-for="country in countries" :key="country.code" :value="country.code">
                {{ country.name }}
              </option>
            </select>
          </div>
          <div v-if="hasCountryError" class="error-message">
            <i class="fas fa-exclamation-circle"></i> {{ getCountryErrorMessage }}
          </div>
          <div v-if="isLoadingCountries" class="info-message">
            <i class="fas fa-spinner fa-spin"></i> Loading countries...
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
              placeholder="5-10 chars with number and special char"
              @input="validatePasswordOnChange"
            />
          </div>
          <div v-if="state.password && state.password.length > 0" class="password-strength-indicator">
            <div 
              class="strength-bar" 
              :style="{ width: passwordStrength + '%' }"
              :class="passwordStrengthClass"
            ></div>
          </div>
          <div v-if="passwordHints && passwordHints.length > 0" class="password-hints">
            <div v-for="(hint, index) in passwordHints" :key="index" class="hint-item">
              <i :class="hint.fulfilled ? 'fas fa-check text-success' : 'fas fa-times text-danger'"></i>
              <span>{{ hint.text }}</span>
            </div>
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
              @input="validateConfirmPasswordOnChange"
            />
          </div>
          <div v-if="state.password && state.confirmPassword" class="match-info">
            <span v-if="passwordsMatch" class="text-success">
              <i class="fas fa-check-circle"></i> Passwords match
            </span>
            <span v-else class="text-danger">
              <i class="fas fa-times-circle"></i> Passwords do not match
            </span>
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
import { reactive, computed, onMounted, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength, maxLength, email, sameAs, helpers } from '@vuelidate/validators';
import axios from 'axios';

// Custom validators
const lettersOnly = helpers.regex(/^[a-zA-Z]+$/);
const hasNumber = helpers.regex(/[0-9]/);
const hasSpecialChar = helpers.regex(/[!@#$%^&*()_+\-=[]{};':"|,.<>/);

export default {
  name: "RegisterPage",
  setup(_, { expose }) {
    const state = reactive({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      password: '',
      confirmPassword: '',
    });
    
    const isLoadingCountries = ref(true);
    const countries = ref([]);

    const rules = {
      username: { 
        required, 
        minLength: minLength(3), 
        maxLength: maxLength(8), 
        lettersOnly: { 
          $validator: lettersOnly, 
          $message: 'Username must contain only letters.' 
        } 
      },
      firstName: { required },
      lastName: { required },
      email: { required, email },
      country: { required },
      password: { 
        required, 
        minLength: minLength(5), 
        maxLength: maxLength(10),
        hasNumber: {
          $validator: hasNumber,
          $message: 'Password must contain at least one number.'
        },
        hasSpecialChar: {
          $validator: hasSpecialChar,
          $message: 'Password must contain at least one special character.'
        }
      },
      confirmPassword: { 
        required, 
        sameAsPassword: sameAs('password') 
      }
    };

    const v$ = useVuelidate(rules, state);
    
    // Computed properties for username validation
    const hasUsernameError = computed(() => v$.value.username.$error);
    const getUsernameErrorMessage = computed(() => {
      if (v$.value.username.required.$invalid) {
        return 'Username is required.';
      }
      if (v$.value.username.minLength.$invalid) {
        return 'Username must be at least 3 characters.';
      }
      if (v$.value.username.maxLength.$invalid) {
        return 'Username cannot exceed 8 characters.';
      }
      if (v$.value.username.lettersOnly.$invalid) {
        return 'Username must contain only letters.';
      }
      return '';
    });
    
    // Computed properties for first name validation
    const hasFirstNameError = computed(() => v$.value.firstName.$error);
    const getFirstNameErrorMessage = computed(() => {
      if (v$.value.firstName.required.$invalid) {
        return 'First name is required.';
      }
      return '';
    });
    
    // Computed properties for last name validation
    const hasLastNameError = computed(() => v$.value.lastName.$error);
    const getLastNameErrorMessage = computed(() => {
      if (v$.value.lastName.required.$invalid) {
        return 'Last name is required.';
      }
      return '';
    });
    
    // Computed properties for email validation
    const hasEmailError = computed(() => v$.value.email.$error);
    const getEmailErrorMessage = computed(() => {
      if (v$.value.email.required.$invalid) {
        return 'Email is required.';
      }
      if (v$.value.email.email.$invalid) {
        return 'Please enter a valid email address.';
      }
      return '';
    });
    
    // Computed properties for country validation
    const hasCountryError = computed(() => v$.value.country.$error);
    const getCountryErrorMessage = computed(() => {
      if (v$.value.country.required.$invalid) {
        return 'Please select your country.';
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
        return 'Password must be at least 5 characters.';
      }
      if (v$.value.password.maxLength.$invalid) {
        return 'Password cannot exceed 10 characters.';
      }
      if (v$.value.password.hasNumber.$invalid) {
        return 'Password must include at least one number.';
      }
      if (v$.value.password.hasSpecialChar.$invalid) {
        return 'Password must include at least one special character.';
      }
      return '';
    });
    
    // Password strength calculation
    const passwordStrength = computed(() => {
      if (!state.password) return 0;
      
      let strength = 0;
      
      // Length check
      if (state.password.length >= 5) strength += 20;
      if (state.password.length >= 8) strength += 10;
      
      // Character type checks
      if (/[0-9]/.test(state.password)) strength += 20;
      if (/[a-z]/.test(state.password)) strength += 15;
      if (/[A-Z]/.test(state.password)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(state.password)) strength += 20;
      
      return Math.min(100, strength);
    });
    
    const passwordStrengthClass = computed(() => {
      const strength = passwordStrength.value;
      if (strength < 40) return 'weak';
      if (strength < 70) return 'medium';
      return 'strong';
    });
    
    // Real-time password requirement hints
    const passwordHints = computed(() => {
      if (!state.password) return [];
      
      return [
        { 
          text: 'Between 5-10 characters', 
          fulfilled: state.password.length >= 5 && state.password.length <= 10 
        },
        { 
          text: 'Contains at least one number', 
          fulfilled: /[0-9]/.test(state.password) 
        },
        { 
          text: 'Contains at least one special character', 
          fulfilled: /[^a-zA-Z0-9]/.test(state.password) 
        }
      ];
    });
    
    // Computed properties for confirm password validation
    const hasConfirmPasswordError = computed(() => v$.value.confirmPassword.$error);
    const getConfirmPasswordErrorMessage = computed(() => {
      if (v$.value.confirmPassword.required.$invalid) {
        return 'Confirm password is required.';
      }
      if (v$.value.confirmPassword.sameAsPassword.$invalid) {
        return 'Passwords must match.';
      }
      
      return '';
    });
    
    // Simplified password matching check
    const passwordsMatch = computed(() => {
      return state.password === state.confirmPassword;
    });
    
    // Simplified real-time validation methods
    const validatePasswordOnChange = () => {
      // Reset validation state for both password fields
      v$.value.$reset();
    };
    
    const validateConfirmPasswordOnChange = () => {
      // Reset validation state for confirm password
      v$.value.$reset();
    };

    // Fetch countries from the API
    const fetchCountries = async () => {
      isLoadingCountries.value = true;
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        // Format the countries data
        countries.value = response.data.map(country => ({
          name: country.name.common,
          code: country.cca3,
          flag: country.flags?.svg
        })).sort((a, b) => a.name.localeCompare(b.name));
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        // Provide some default countries if API fails
        countries.value = [
          { name: 'United States', code: 'USA' },
          { name: 'United Kingdom', code: 'GBR' },
          { name: 'Canada', code: 'CAN' },
          { name: 'Australia', code: 'AUS' },
          { name: 'Israel', code: 'ISR' }
        ];
      } finally {
        isLoadingCountries.value = false;
      }
    };

    const register = async () => {
      try {
        // Reset validation state
        v$.value.$reset();
        
        // Check password match manually first
        if (state.password !== state.confirmPassword) {
          console.warn("Validation Error: Passwords do not match");
          return;
        }
        
        // // Then run validation
        // const isValid = await v$.value.$validate();
        // if (!isValid) {
        //   console.warn("Validation Error: Please check all fields");
        //   return;
        // }
        
        // Proceed with registration
        const baseURL = window.store.server_domain || 'http://localhost:3000';
        await window.axios.post(`${baseURL}/register`, {
          username: state.username,
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          country: state.country,
          password: state.password
        });
        
        console.log("Registration Successful: You can now login");
        window.router.push('/login');
      } catch (err) {
        console.error('Registration error:', err);
        const errorMessage = err.response?.data?.message || "An error occurred during registration";
        console.error("Registration failed:", errorMessage);
      }
    };

    // Fetch countries when component mounts
    onMounted(() => {
      fetchCountries();
      
      // Reset validation state
      if (v$.value) {
        v$.value.$reset();
      }
    });

    expose({ register });

    return { 
      state, 
      v$, 
      register,
      countries,
      isLoadingCountries,
      hasUsernameError,
      getUsernameErrorMessage,
      hasFirstNameError,
      getFirstNameErrorMessage,
      hasLastNameError,
      getLastNameErrorMessage,
      hasEmailError,
      getEmailErrorMessage,
      hasCountryError,
      getCountryErrorMessage,
      hasPasswordError,
      getPasswordErrorMessage,
      passwordStrength,
      passwordStrengthClass,
      passwordHints,
      validatePasswordOnChange,
      hasConfirmPasswordError,
      getConfirmPasswordErrorMessage,
      passwordsMatch,
      validateConfirmPasswordOnChange
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

/* Password Strength Indicator */
.password-strength-indicator {
  height: 4px;
  background-color: #eee;
  margin-top: 8px;
  border-radius: 2px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.strength-bar.weak {
  background-color: #ff4d4f;
}

.strength-bar.medium {
  background-color: #faad14;
}

.strength-bar.strong {
  background-color: #52c41a;
}

/* Password Hints */
.password-hints {
  margin-top: 8px;
  font-size: 0.85rem;
}

.hint-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.hint-item i {
  margin-right: 6px;
  width: 16px;
}

/* Password Match Indicator */
.match-info {
  margin-top: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.match-info i {
  margin-right: 5px;
}

.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: 8px;
}

.info-message {
  color: #1890ff;
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
