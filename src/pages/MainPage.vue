<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Recipe Explorer</h1>
      <p class="subtitle">Discover delicious recipes for any occasion</p>
    </div>
    
    <div class="section">
      <h2 class="section-title">Random Recipes</h2>
      <RecipePreviewList title="" class="recipe-list" />
    </div>
    
    <div v-if="!store.username" class="login-prompt">
      <div class="login-prompt-content">
        <i class="fas fa-lock login-icon"></i>
        <h3>Access Your Personal Recipe Collection</h3>
        <p>Sign in to view your recently viewed recipes and favorites</p>
        <router-link :to="{ name: 'login' }" class="login-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </router-link>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title">Last Viewed Recipes</h2>
      <RecipePreviewList
        title=""
        :class="{
          'recipe-list': true,
          'blur-content': !store.username
        }"
        disabled
      />
      
      <div v-if="!store.username" class="blur-overlay">
        <div class="overlay-content">
          <i class="fas fa-user-lock"></i>
          <p>Login to see your viewed recipes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: "MainPage",
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  }
};
</script>

<style lang="scss" scoped>
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
  position: relative;
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

/* Section Styling */
.section {
  margin-bottom: 60px;
  position: relative;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.recipe-list {
  margin: 20px 0;
}

/* Login Prompt */
.login-prompt {
  background-color: #f0f5ff;
  border-radius: 16px;
  padding: 30px;
  margin: 40px 0;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.login-prompt-content {
  max-width: 500px;
  margin: 0 auto;
}

.login-icon {
  font-size: 3rem;
  color: #1a73e8;
  margin-bottom: 20px;
}

.login-prompt h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.login-prompt p {
  color: #666;
  margin-bottom: 20px;
}

.login-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #1a73e8;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0d62c9;
}

/* Blur Effect */
.blur-content {
  filter: blur(4px);
  pointer-events: none;
}

.blur-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  pointer-events: none;
}

.overlay-content {
  text-align: center;
  color: #1a73e8;
}

.overlay-content i {
  font-size: 3rem;
  margin-bottom: 15px;
}

.overlay-content p {
  font-size: 1.2rem;
  font-weight: 500;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
