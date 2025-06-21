<template>  <div class="container py-5">
    <div class="row mb-5">
      <div class="col-12 text-center">
        <h1 class="display-4 fw-bold text-primary">Welcome Back, {{ store.username }}!</h1>
        <p class="lead text-muted">Your personal recipe area</p>
      </div>
    </div>
      <!-- Quick Actions -->
    <div class="row mb-5">
      <div class="col-12 text-center mb-4">
        <h2 class="h3 fw-bold">Quick Actions</h2>
        <hr class="divider mx-auto">
      </div>
      <div class="col-md-10 mx-auto">
        <div class="row g-4">
          <div class="col-md-4">
            <router-link to="/search" class="quick-action-card card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-search action-icon text-primary mb-3"></i>
                <h3 class="h5 fw-bold">Find Recipes</h3>
                <p class="text-muted small">Search for new recipes to try</p>
              </div>
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link to="/favorites" class="quick-action-card card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-heart action-icon text-danger mb-3"></i>
                <h3 class="h5 fw-bold">My Favorites</h3>
                <p class="text-muted small">View your saved recipes</p>
              </div>
            </router-link>          </div>
          <div class="col-md-4 mt-4">
            <router-link to="/family-recipes" class="quick-action-card card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-book-open action-icon text-warning mb-3"></i>
                <h3 class="h5 fw-bold">Family Recipes</h3>
                <p class="text-muted small">Explore treasured family recipes</p>
              </div>
            </router-link>
          </div>
          <div class="col-md-4 mt-4">
            <div class="quick-action-card card border-0 shadow-sm h-100 cursor-pointer" @click="openRecipeCreationModal">
              <div class="card-body text-center p-4">
                <i class="fas fa-plus-circle action-icon text-success mb-3"></i>
                <h3 class="h5 fw-bold">Create Recipe</h3>
                <p class="text-muted small">Add your own recipe</p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mt-4">
            <router-link to="/about" class="quick-action-card card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-info-circle action-icon text-info mb-3"></i>
                <h3 class="h5 fw-bold">About Us</h3>
                <p class="text-muted small">Meet our development team</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
      <!-- Recently Viewed Recipes -->
    <div class="row mb-5">
      <div class="col-12 text-center mb-4">
        <h2 class="h3 fw-bold">Recently Viewed Recipes</h2>
        <hr class="divider mx-auto">
      </div>
      <div class="col-12">
        <div v-if="viewedRecipes.length === 0" class="text-center py-5">
          <i class="fas fa-search text-muted mb-3 display-4"></i>
          <h3 class="h5 fw-bold">No Recently Viewed Recipes</h3>
          <p class="text-muted">Start exploring to see your recently viewed recipes</p>
          <router-link to="/search" class="btn btn-primary mt-3">Find Recipes</router-link>
        </div>
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="recipe in viewedRecipes.slice(0, 3)" :key="recipe.id" class="col">
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
                  <span v-if="recipe.vegan" class="badge bg-success me-1">
                    <i class="fas fa-seedling me-1"></i>Vegan
                  </span>
                  <span v-else-if="recipe.vegetarian" class="badge bg-info me-1">
                    <i class="fas fa-leaf me-1"></i>Vegetarian
                  </span>
                  <span v-if="recipe.glutenFree" class="badge bg-warning text-dark me-1">
                    <i class="fas fa-bread-slice me-1"></i>Gluten-Free
                  </span>
                </div>
              </div>
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">{{ recipe.title }}</h5>                <div class="recipe-meta mb-3">
                  <span v-if="recipe.readyInMinutes" class="meta-item me-3">
                    <i class="far fa-clock text-primary me-1"></i> {{ recipe.readyInMinutes }} min
                  </span>
                  <span v-if="recipe.aggregateLikes" class="meta-item">
                    <i class="far fa-heart text-danger me-1"></i> {{ recipe.aggregateLikes }}
                  </span>
                </div>
                <router-link 
                  v-if="recipe.id" 
                  :to="{ name: 'recipe', params: { recipeId: recipe.id } }" 
                  class="btn btn-primary mt-auto">
                  View Recipe Details
                </router-link>
                <button 
                  v-else 
                  class="btn btn-secondary mt-auto" 
                  @click="alert('Recipe ID not available. Cannot view details.')">
                  View Recipe Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- My Recipes Section -->
    <div class="row mb-5">
      <div class="col-12 text-center mb-4">
        <h2 class="h3 fw-bold">My Recipes</h2>
        <hr class="divider mx-auto">
      </div>
      <div class="col-12">
        <div v-if="myRecipes.length === 0" class="text-center py-5">
          <i class="fas fa-utensils text-muted mb-3 display-4"></i>
          <h3 class="h5 fw-bold">No Personal Recipes Yet</h3>
          <p class="text-muted">Create your first recipe to see it here</p>
          <button class="btn btn-success mt-3" @click="openRecipeCreationModal">
            <i class="fas fa-plus me-2"></i>Create Recipe
          </button>
        </div>        <div v-else>
          <div v-if="!showAllRecipes" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div v-for="recipe in myRecipes.slice(0, 3)" :key="recipe.id" class="col">
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
                    <span v-if="recipe.vegan" class="badge bg-success me-1">
                      <i class="fas fa-seedling me-1"></i>Vegan
                    </span>
                    <span v-else-if="recipe.vegetarian" class="badge bg-info me-1">
                      <i class="fas fa-leaf me-1"></i>Vegetarian
                    </span>
                    <span v-if="recipe.glutenFree" class="badge bg-warning text-dark me-1">
                      <i class="fas fa-bread-slice me-1"></i>Gluten-Free
                    </span>
                  </div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title fw-bold">{{ recipe.title }}</h5>                <div class="recipe-meta mb-3">
                    <span v-if="recipe.readyInMinutes" class="meta-item me-3">
                      <i class="far fa-clock text-primary me-1"></i> {{ recipe.readyInMinutes }} min
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-utensils text-success me-1"></i> My Recipe
                    </span>
                  </div>
                  <router-link 
                    v-if="recipe.id" 
                    :to="{ name: 'recipe', params: { recipeId: 'user_' + recipe.id } }" 
                    class="btn btn-primary mt-auto">
                    View Recipe Details
                  </router-link>
                  <button 
                    v-else 
                    class="btn btn-secondary mt-auto" 
                    @click="alert('Recipe ID not available. Cannot view details.')">
                    View Recipe Details
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12 text-center mt-4" v-if="myRecipes.length > 3">
              <button class="btn btn-outline-primary" @click="showAllRecipes = true">
                <i class="fas fa-list me-2"></i>View All My Recipes ({{ myRecipes.length }})
              </button>
            </div>
          </div>
          
          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div v-for="recipe in myRecipes" :key="recipe.id" class="col">
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
                    <span v-if="recipe.vegan" class="badge bg-success me-1">
                      <i class="fas fa-seedling me-1"></i>Vegan
                    </span>
                    <span v-else-if="recipe.vegetarian" class="badge bg-info me-1">
                      <i class="fas fa-leaf me-1"></i>Vegetarian
                    </span>
                    <span v-if="recipe.glutenFree" class="badge bg-warning text-dark me-1">
                      <i class="fas fa-bread-slice me-1"></i>Gluten-Free
                    </span>
                  </div>
                </div>
                <div class="card-body d-flex flex-column">
                  <h5 class="card-title fw-bold">{{ recipe.title }}</h5>                <div class="recipe-meta mb-3">
                    <span v-if="recipe.readyInMinutes" class="meta-item me-3">
                      <i class="far fa-clock text-primary me-1"></i> {{ recipe.readyInMinutes }} min
                    </span>
                    <span class="meta-item">
                      <i class="fas fa-utensils text-success me-1"></i> My Recipe
                    </span>
                  </div>
                  <router-link 
                    v-if="recipe.id" 
                    :to="{ name: 'recipe', params: { recipeId: recipe.id } }" 
                    class="btn btn-primary mt-auto">
                    View Recipe Details
                  </router-link>
                  <button 
                    v-else 
                    class="btn btn-secondary mt-auto" 
                    @click="alert('Recipe ID not available. Cannot view details.')">
                    View Recipe Details
                  </button>
                </div>
              </div>
            </div>
            <div class="col-12 text-center mt-4">
              <button class="btn btn-outline-secondary" @click="showAllRecipes = false">
                <i class="fas fa-compress-alt me-2"></i>Show Less
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>  </div>
  
  <!-- Recipe Creation Modal Component -->
  <RecipeCreationModal ref="recipeCreationModal" @recipe-created="onRecipeCreated" />
</template>

<script>
import { getCurrentInstance } from 'vue';
import favoritesService from '../services/favoritesService';
import userRecipesService from '../services/userRecipesService';
import RecipeCreationModal from '../components/RecipeCreationModal.vue';

export default {
  name: 'PersonalAreaPage',
  components: {
    RecipeCreationModal
  },
  data() {    return {
      viewedRecipes: [],
      favoriteRecipes: [],
      myRecipes: [],
      myCollections: [],
      showAllRecipes: false
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    
    return { store };
  },
  mounted() {
    // Check if user is logged in
    if (!this.store.username) {
      this.$router.push({ name: 'login' });
      return;
    }
    
    this.loadUserData();
  },
  methods: {
    async loadUserData() {
      // Fetch favorite recipes using our service
      try {
        const favorites = await favoritesService.getFavorites();
        this.favoriteRecipes = favorites || [];
      } catch (error) {
        console.error("Error fetching favorites:", error);
        this.favoriteRecipes = [];
      }
        // Fetch user's personal recipes
      try {
        const userRecipes = await userRecipesService.getUserRecipes();
        // Ensure each recipe has an id property for router links
        this.myRecipes = (userRecipes || []).map(recipe => {
          // If the recipe has _id but not id, copy _id to id
          if (recipe._id && !recipe.id) {
            return { ...recipe, id: recipe._id };
          }
          // If the recipe has recipe_id but not id, copy recipe_id to id
          if (recipe.recipe_id && !recipe.id) {
            return { ...recipe, id: recipe.recipe_id };
          }
          return recipe;
        });
        console.log("Processed user recipes:", this.myRecipes);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
        this.myRecipes = [];      }
      
      // Load viewed recipes from localStorage
      try {
        const viewedRecipesJSON = localStorage.getItem('viewedRecipes') || '[]';
        const viewedRecipes = JSON.parse(viewedRecipesJSON);
        this.viewedRecipes = Array.isArray(viewedRecipes) ? viewedRecipes : [];
        console.log("Loaded viewed recipes from localStorage:", this.viewedRecipes);
      } catch (error) {
        console.error("Error loading viewed recipes from localStorage:", error);
        this.viewedRecipes = [];
      }
    },
    
    openRecipeCreationModal() {
      this.$refs.recipeCreationModal.show();
    },
      onRecipeCreated(newRecipe) {
      // Ensure the recipe has an id property for router links
      let processedRecipe = newRecipe;
      
      // If the recipe has recipe_id but not id, copy recipe_id to id
      if (newRecipe.recipe_id && !newRecipe.id) {
        processedRecipe = { ...newRecipe, id: newRecipe.recipe_id };
      }
      // If the recipe has _id but not id, copy _id to id
      else if (newRecipe._id && !newRecipe.id) {
        processedRecipe = { ...newRecipe, id: newRecipe._id };
      }
      
      console.log("Adding new recipe with ID:", processedRecipe.id);
      
      // Add the processed recipe to the my recipes list
      this.myRecipes.unshift(processedRecipe);
    },
    
    alert(message) {
      alert(message);
    }
  }
};
</script>

<style scoped>
.divider {
  width: 60px;
  height: 4px;
  background-color: #1a73e8;
  margin: 15px auto;
  border-radius: 2px;
}

.action-icon {
  font-size: 2.5rem;
  display: block;
}

.quick-action-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.quick-action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.recipe-image-wrapper {
  position: relative;
  height: 200px;
}

.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.recipe-image-placeholder {
  width: 100%;
  height: 200px;
  background-color: #f8f9fa;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
}

.recipe-badges {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.recipe-badges .badge {
  font-size: 0.7rem;
  padding: 5px 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.recipe-meta {
  font-size: 0.9rem;
  color: #6c757d;
}

.meta-item {
  display: inline-flex;
  align-items: center;
}

.recipe-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
</style>
