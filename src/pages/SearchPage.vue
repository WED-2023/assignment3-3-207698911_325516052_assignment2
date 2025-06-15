<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col-12 text-center">
        <h1 class="display-4 fw-bold text-primary">Recipe Explorer</h1>
        <p class="lead text-muted">Discover delicious recipes for any occasion</p>
      </div>
    </div>
    
    <!-- Search Form -->
    <div class="row justify-content-center mb-5">
      <div class="col-md-8">
        <div class="card search-card shadow-sm border-0">
          <div class="card-body p-4">
            <div class="input-group mb-3">
              <span class="input-group-text bg-transparent border-end-0">
                <i class="fas fa-search text-muted"></i>
              </span>
              <input 
                type="text" 
                v-model="searchQuery" 
                placeholder="Find a recipe..." 
                class="form-control border-start-0"
                @keyup.enter="searchRecipes"
              />
              <button @click="searchRecipes" class="btn btn-primary">
                Search
              </button>
            </div>
            <div class="text-center">
              <button @click="fetchRandomRecipe" class="btn btn-outline-primary">
                <i class="fas fa-random me-2"></i> Surprise Me
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading and Error States -->
    <div v-if="loading" class="row justify-content-center mb-5">
      <div class="col-md-8 text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Finding the perfect recipes for you...</p>
      </div>
    </div>
    
    <div v-if="error" class="row justify-content-center mb-5">
      <div class="col-md-8">
        <div class="alert alert-danger d-flex align-items-center" role="alert">
          <i class="fas fa-exclamation-circle me-3 fs-4"></i>
          <div class="flex-grow-1">{{ error }}</div>
          <button @click="dismissError" class="btn-close" aria-label="Close"></button>
        </div>
      </div>
    </div>
    
    <!-- Search Results -->
    <div v-if="recipes && recipes.length" class="mb-5">
      <div class="row mb-4">
        <div class="col-12 text-center">
          <h2 class="h3 fw-bold">
            <span class="text-primary">{{ recipes.length }}</span> recipes found
          </h2>
          <hr class="divider mx-auto">
        </div>
      </div>
      
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="recipe in recipes" :key="recipe.id" class="col">
          <div class="card h-100 recipe-card border-0 shadow-sm">
            <div class="position-relative overflow-hidden recipe-image-wrapper">
              <img 
                v-if="recipe.image" 
                :src="recipe.image" 
                :alt="recipe.title" 
                class="card-img-top recipe-image"
              />
              <div v-else class="recipe-image-placeholder">
                <i class="fas fa-utensils"></i>
              </div>
              
              <!-- Recipe badges -->
              <div class="recipe-badges">
                <span v-if="recipe.vegan" class="badge bg-success me-1">Vegan</span>
                <span v-if="recipe.vegetarian && !recipe.vegan" class="badge bg-info me-1">Vegetarian</span>
                <span v-if="recipe.glutenFree" class="badge bg-warning text-dark">Gluten-Free</span>
              </div>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-bold">{{ recipe.title }}</h5>
              <div class="recipe-meta mb-3">
                <span v-if="recipe.readyInMinutes" class="meta-item me-3">
                  <i class="far fa-clock text-primary me-1"></i> {{ recipe.readyInMinutes }} min
                </span>
                <span v-if="recipe.popularity" class="meta-item">
                  <i class="far fa-heart text-danger me-1"></i> {{ recipe.popularity }}
                </span>
              </div>
              <a :href="'#/recipe/' + recipe.id" class="btn btn-primary mt-auto">
                View Recipe Details
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="recipes && recipes.length === 0" class="row justify-content-center mb-5">
      <div class="col-md-8 text-center py-5">
        <div class="no-results-icon mb-3">🔍</div>
        <h3 class="h4 mb-3">No recipes found</h3>
        <p class="text-muted">Try different keywords or check your spelling</p>
      </div>
    </div>
    
    <!-- Debug Response Data (Collapsible) -->
    <div v-if="rawResponse" class="row justify-content-center">
      <div class="col-md-8 text-center mb-3">
        <button @click="toggleDebug" class="btn btn-sm btn-outline-secondary">
          {{ showDebug ? 'Hide' : 'Show' }} Response Data
        </button>
      </div>
      <div v-if="showDebug" class="col-md-8">
        <div class="card bg-light">
          <div class="card-body">
            <pre class="mb-0 text-muted"><code>{{ rawResponse }}</code></pre>
          </div>
        </div>
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
        
        // Store the actual recipes array directly
        this.recipes = response.data;
        
        // Log the response to console for debugging
        console.log("Random recipe response:", response.data);
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
/* Bootstrap CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.recipe-card {
  animation: fadeIn 0.5s ease forwards;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
}

.recipe-image-wrapper {
  height: 200px;
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
  font-size: 2.5rem;
}

.recipe-badges {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

/* Divider style */
.divider {
  width: 60px;
  height: 3px;
  background-color: #1a73e8;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 15px;
}

/* Search card hover effect */
.search-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
}

.search-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

/* No results icon */
.no-results-icon {
  font-size: 4rem;
  color: #ccc;
}

/* Meta items styling */
.meta-item {
  font-size: 0.9rem;
  color: #666;
  display: inline-flex;
  align-items: center;
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
