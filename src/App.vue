<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div class="container">
        <router-link :to="{ name: 'main' }" class="navbar-brand d-flex align-items-center">
          <i class="fas fa-utensils text-primary me-2"></i>
          <span class="fw-bold">Recipe Explorer</span>
        </router-link>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link :to="{ name: 'main' }" class="nav-link">
                <i class="fas fa-home me-1"></i> Home
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'search' }" class="nav-link">
                <i class="fas fa-search me-1"></i> Search
              </router-link>
            </li>
            <li class="nav-item" v-if="store.username">
              <router-link :to="{ name: 'dashboard' }" class="nav-link">
                <i class="fas fa-tachometer-alt me-1"></i> Dashboard
              </router-link>
            </li>
          </ul>
          
          <div v-if="!store.username" class="d-flex">
            <router-link :to="{ name: 'register' }" class="btn btn-outline-primary me-2">
              <i class="fas fa-user-plus me-1"></i> Register
            </router-link>
            <router-link :to="{ name: 'login' }" class="btn btn-primary">
              <i class="fas fa-sign-in-alt me-1"></i> Login
            </router-link>
          </div>
          <div v-else class="d-flex align-items-center">
            <div class="me-3 d-flex align-items-center">
              <div class="avatar-circle me-2 bg-primary text-white">
                <i class="fas fa-user"></i>
              </div>
              <span class="fw-bold">{{ store.username }}</span>
            </div>
            <button @click="logout" class="btn btn-outline-danger">
              <i class="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    const router = internalInstance.appContext.config.globalProperties.$router;

    const logout = () => {
      store.logout();
      toast("Logout", "User logged out successfully", "success");
      router.push("/").catch(() => {});
    };

    return { store, logout };
  }
}
</script>

<style lang="scss">
@import "@/scss/form-style.scss";
/* Font import for better typography */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
/* Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
/* Bootstrap CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');

#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* Custom Styles */
.navbar {
  padding: 12px 0;
}

.navbar-brand {
  font-size: 1.4rem;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

/* Override Bootstrap primary color */
.btn-primary, .bg-primary, .text-primary {
  --bs-primary: #1a73e8;
  --bs-primary-rgb: 26, 115, 232;
}

.btn-primary {
  background-color: #1a73e8;
  border-color: #1a73e8;
}

.btn-primary:hover, .btn-primary:focus {
  background-color: #0d62c9;
  border-color: #0d62c9;
}

.btn-outline-primary {
  color: #1a73e8;
  border-color: #1a73e8;
}

.btn-outline-primary:hover, .btn-outline-primary:focus {
  background-color: #1a73e8;
  border-color: #1a73e8;
}

.text-primary {
  color: #1a73e8 !important;
}

/* Logo Styling */
.navbar-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1a73e8;
  font-weight: 700;
  font-size: 1.5rem;
  transition: color 0.3s;
}

.logo-link:hover {
  color: #0d62c9;
}

.logo-link i {
  margin-right: 10px;
  font-size: 1.8rem;
}

/* Navigation Links */
.navbar-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: #555;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.nav-link i {
  margin-right: 6px;
}

.nav-link:hover, .nav-link.router-link-exact-active {
  color: #1a73e8;
  background-color: rgba(26, 115, 232, 0.05);
}

.nav-link.router-link-exact-active {
  font-weight: 600;
}

/* Auth Section */
.navbar-auth {
  display: flex;
  align-items: center;
}

.guest-menu, .user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.auth-button {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.auth-button i {
  margin-right: 6px;
}

.register-button {
  background-color: transparent;
  color: #555;
  border: 1px solid #ddd;
}

.register-button:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
}

.login-button {
  background-color: #1a73e8;
  color: white;
}

.login-button:hover {
  background-color: #0d62c9;
}

.logout-button {
  background-color: #f5f5f5;
  color: #555;
}

.logout-button:hover {
  background-color: #e0e0e0;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  margin-right: 10px;
  padding: 6px 12px;
  background-color: #f5f5f5;
  border-radius: 50px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #1a73e8;
  color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
}

.username {
  font-weight: 500;
  color: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
  
  .navbar-links {
    width: 100%;
    justify-content: center;
  }
  
  .navbar-auth {
    width: 100%;
    justify-content: center;
  }
}
</style>
