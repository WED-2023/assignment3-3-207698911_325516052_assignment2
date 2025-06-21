<template>
  <div v-if="store.username" class="container">
    <div class="header">
      <h1 class="title">Recipe Explorer</h1>
      <p class="subtitle">Discover delicious recipes for any occasion</p>
    </div>
    
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Random Recipes</h2>
        <button @click="shuffleRecipes" class="shuffle-button">
          <i class="fas fa-random"></i> Shuffle
        </button>
      </div>
      <RecipePreviewList ref="recipeList" title="" class="recipe-list" />
    </div>
  </div>
  
  <!-- Locked page for non-signed-in users -->
  <div v-else class="container locked-container">
    <div class="login-prompt">
      <div class="login-prompt-content">
        <i class="fas fa-lock login-icon"></i>
        <h2>Recipe Explorer</h2>
        <h3>Access Your Personal Recipe Collection</h3>
        <p>Sign in to explore random recipes and create your favorites</p>
        <router-link :to="{ name: 'login' }" class="login-button">
          <i class="fas fa-sign-in-alt"></i> Login
        </router-link>
        <div class="or-divider">or</div>
        <router-link :to="{ name: 'register' }" class="register-button">
          <i class="fas fa-user-plus"></i> Register
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from 'vue';
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  name: "MainPage",
  components: {
    RecipePreviewList
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const recipeList = ref(null);

    // Method to shuffle recipes by triggering updateRecipes in RecipePreviewList
    const shuffleRecipes = () => {
      if (recipeList.value) {
        recipeList.value.updateRecipes();
      }
    };

    return { 
      store,
      recipeList,
      shuffleRecipes
    };
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0;
}

.recipe-list {
  margin: 20px 0;
}

/* Shuffle Button */
.shuffle-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.shuffle-button:hover {
  background-color: #0d62c9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.shuffle-button:active {
  transform: translateY(0);
}

.shuffle-button i {
  font-size: 1.1rem;
}

/* Locked Container */
.locked-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

/* Login Prompt */
.login-prompt {
  background-color: #f0f5ff;
  border-radius: 16px;
  padding: 40px;
  margin: 40px 0;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.login-prompt-content {
  max-width: 500px;
  margin: 0 auto;
}

.login-icon {
  font-size: 3.5rem;
  color: #1a73e8;
  margin-bottom: 20px;
}

.login-prompt h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 15px;
}

.login-prompt h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.login-prompt p {
  color: #666;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.login-button, .register-button {
  display: inline-block;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s;
  width: 100%;
  max-width: 250px;
}

.login-button {
  background-color: #1a73e8;
  color: white;
}

.login-button:hover {
  background-color: #0d62c9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.register-button {
  background-color: #34a853;
  color: white;
}

.register-button:hover {
  background-color: #2d8e47;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.or-divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  color: #666;
  font-weight: 500;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
  margin: 0 15px;
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
