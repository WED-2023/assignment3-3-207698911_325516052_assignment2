<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Recipe Explorer</h1>
      <p class="subtitle">Discover delicious recipes for any occasion</p>
    </div>
    
    <!-- Search Form -->
    <div class="search-container">
      <div class="search-form">
        <div class="search-icon">
          <i class="fas fa-search"></i>
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Find a recipe..." 
          class="search-input"
          @keyup.enter="searchRecipes"
        />
        <button @click="searchRecipes" class="search-button">
          Search
        </button>
      </div>
      <button @click="fetchRandomRecipe" class="random-button">
        <i class="fas fa-random"></i> Surprise Me
      </button>
    </div>
    
    <!-- Loading and Error States -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Finding the perfect recipes for you...</p>
    </div>
    
    <div v-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="dismissError" class="dismiss-button">Dismiss</button>
    </div>
    
    <!-- Search Results -->
    <transition name="fade">
      <div v-if="recipes && recipes.length" class="results-container">
        <h2 class="results-title">
          <span class="highlight">{{ recipes.length }}</span> recipes found
        </h2>
        
        <div class="recipe-grid">
          <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
            <div class="recipe-image-container">
              <img 
                v-if="recipe.image" 
                :src="recipe.image" 
                :alt="recipe.title" 
                class="recipe-image"
              />
              <div v-else class="recipe-image-placeholder">
                <i class="fas fa-utensils"></i>
              </div>
            </div>
            <div class="recipe-content">
              <h3 class="recipe-title">{{ recipe.title }}</h3>
              <p v-if="recipe.description" class="recipe-description">
                {{ truncateText(recipe.description, 100) }}
              </p>
              <div class="recipe-meta">
                <span v-if="recipe.prepTime" class="meta-item">
                  <i class="far fa-clock"></i> {{ recipe.prepTime }}
                </span>
                <span v-if="recipe.difficulty" class="meta-item difficulty">
                  {{ recipe.difficulty }}
                </span>
              </div>
              <button class="view-recipe-button">View Recipe</button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <div v-if="recipes && recipes.length === 0" class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3>No recipes found</h3>
      <p>Try different keywords or check your spelling</p>
    </div>
    
    <!-- Debug Response Data (Collapsible) -->
    <div v-if="rawResponse" class="debug-container">
      <button @click="toggleDebug" class="debug-toggle">
        {{ showDebug ? 'Hide' : 'Show' }} Response Data
      </button>
      <div v-if="showDebug" class="debug-response">
        <pre>{{ rawResponse }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SearchPage',
  data() {
    return {
      searchQuery: '',
      recipes: null,
      data: null,
      loading: false,
      error: null,
      rawResponse: null,
      showDebug: false
    };
  },
  methods: {
    async searchRecipes() {
      if (!this.searchQuery.trim()) {
        this.error = "Please enter a search term";
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.rawResponse = null;
      
      try {
        const response = await axios.get(`http://localhost:3000/recipes/search`, {
          params: { query: this.searchQuery }
        });
        
        // Store the raw response for debugging
        this.rawResponse = JSON.stringify(response.data, null, 2);
        
        this.recipes = response.data;
      } catch (err) {
        this.error = `Error searching recipes: ${err.message}`;
        console.error(err);
        
        // Try to display any response information that might be available
        if (err.response) {
          this.rawResponse = JSON.stringify({
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          }, null, 2);
        }
      } finally {
        this.loading = false;
      }
    },
    
    async fetchRandomRecipe() {
      this.loading = true;
      this.error = null;
      this.rawResponse = null;
      
      try {
        const response = await axios.get('http://localhost:3000/recipes/random');
        
        // Store the raw response for debugging
        this.rawResponse = JSON.stringify(response.data, null, 2);
        
        this.data = response.data;
        this.recipes = [response.data]; // Show random recipe in the same format
      } catch (err) {
        this.error = `Error fetching random recipe: ${err.message}`;
        console.error(err);
        
        // Try to display any response information that might be available
        if (err.response) {
          this.rawResponse = JSON.stringify({
            status: err.response.status,
            statusText: err.response.statusText,
            data: err.response.data
          }, null, 2);
        }
      } finally {
        this.loading = false;
      }
    },
    
    toggleDebug() {
      this.showDebug = !this.showDebug;
    },
    
    dismissError() {
      this.error = null;
    },
    
    truncateText(text, maxLength) {
      if (text.length <= maxLength) return text;
      return text.slice(0, maxLength) + '...';
    }
  }
}
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

/* Search Form Styling */
.search-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.search-form {
  display: flex;
  width: 100%;
  max-width: 700px;
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-radius: 50px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  flex: 1;
  padding: 18px 20px 18px 50px;
  font-size: 1rem;
  border: none;
  border-radius: 50px 0 0 50px;
  background-color: #fff;
  transition: box-shadow 0.3s ease;
  outline: none;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.search-button {
  padding: 18px 30px;
  background-color: #1a73e8;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0d62c9;
}

.random-button {
  padding: 12px 24px;
  background-color: transparent;
  color: #1a73e8;
  border: 2px solid #1a73e8;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.random-button:hover {
  background-color: #1a73e8;
  color: white;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(26, 115, 232, 0.1);
  border-radius: 50%;
  border-top-color: #1a73e8;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background-color: #fff3f3;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #ff4d4f;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.dismiss-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: transparent;
  color: #ff4d4f;
  border: 1px solid #ff4d4f;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.dismiss-button:hover {
  background-color: #ff4d4f;
  color: white;
}

/* Results Styling */
.results-container {
  margin-top: 20px;
}

.results-title {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #333;
  text-align: center;
}

.highlight {
  color: #1a73e8;
  font-weight: 700;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.recipe-card {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.recipe-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.recipe-image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f5ff;
  color: #1a73e8;
  font-size: 3rem;
}

.recipe-content {
  padding: 20px;
}

.recipe-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}

.recipe-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.recipe-meta {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  margin-right: 15px;
  color: #666;
  font-size: 0.9rem;
}

.meta-item i {
  margin-right: 5px;
}

.difficulty {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #e6f7ff;
  color: #0050b3;
}

.view-recipe-button {
  width: 100%;
  padding: 12px;
  background-color: #1a73e8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-recipe-button:hover {
  background-color: #0d62c9;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-results-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

/* Debug Info */
.debug-container {
  margin-top: 40px;
  text-align: center;
}

.debug-toggle {
  background-color: #f0f0f0;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  color: #555;
  font-size: 0.9rem;
}

.debug-response {
  margin-top: 15px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  overflow: auto;
  text-align: left;
  border: 1px solid #ddd;
}

.debug-response pre {
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  color: #333;
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
