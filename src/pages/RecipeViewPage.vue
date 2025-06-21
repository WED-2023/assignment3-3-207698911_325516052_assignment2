<template>
  <div class="container py-5">
    <div v-if="recipe" class="recipe-detail">
      <div class="row mb-4">
        <div class="col-12 text-center">
          <h1 class="display-4 fw-bold">{{ recipe.title }}</h1>
          
          <div class="d-flex flex-wrap justify-content-center gap-3 mt-3">
            <span class="badge bg-light text-dark p-2 d-flex align-items-center">
              <i class="far fa-clock text-primary me-2"></i> {{ recipe.readyInMinutes }} minutes
            </span>
            <span class="badge bg-light text-dark p-2 d-flex align-items-center">
              <i class="far fa-heart text-danger me-2"></i> {{ recipe.aggregateLikes }} likes
            </span>
            <span v-if="recipe.servings" class="badge bg-light text-dark p-2 d-flex align-items-center">
              <i class="fas fa-utensils text-success me-2"></i> {{ recipe.servings }} servings
            </span>
          </div>
          
          <!-- Dietary Information -->
          <div class="mt-3 d-flex flex-wrap justify-content-center gap-2">
            <span v-if="recipe.vegan" class="badge bg-success p-2">
              <i class="fas fa-leaf me-1"></i> Vegan
            </span>
            <span v-if="recipe.vegetarian && !recipe.vegan" class="badge bg-info p-2">
              <i class="fas fa-seedling me-1"></i> Vegetarian
            </span>
            <span v-if="recipe.glutenFree" class="badge bg-warning text-dark p-2">
              <i class="fas fa-bread-slice me-1"></i> Gluten-Free
            </span>
          </div>
        </div>
      </div>
      
      <div class="row mb-5">
        <div class="col-md-8 offset-md-2">
          <div class="card shadow-sm border-0 overflow-hidden">
            <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" class="card-img-top recipe-hero-image" />
            <div v-else class="recipe-image-placeholder bg-light text-primary p-5 text-center">
              <i class="fas fa-utensils fa-4x"></i>
            </div>
            
            <div v-if="recipe.summary" class="card-body">
              <h3 class="h5 mb-3 fw-bold">About this recipe</h3>
              <div class="recipe-summary" v-html="recipe.summary"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mb-5">
        <div class="col-md-5">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-primary text-white">
              <h2 class="h5 mb-0"><i class="fas fa-list me-2"></i> Ingredients</h2>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush ingredients-list">
                <li v-for="(ingredient, index) in recipe.extendedIngredients" 
                    :key="index + '_' + ingredient.id" 
                    class="list-group-item border-0 py-2">
                  <i class="fas fa-check-circle text-success me-2"></i>
                  {{ ingredient.original }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="col-md-7">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white">
              <h2 class="h5 mb-0"><i class="fas fa-tasks me-2"></i> Instructions</h2>
            </div>
            <div class="card-body">
              <ol class="list-group list-group-flush instruction-steps">
                <li v-for="(step, index) in recipe._instructions" 
                    :key="step.number" 
                    :style="{ 'animation-delay': index * 0.1 + 's' }"
                    class="list-group-item border-0 py-3 d-flex">
                  <span class="step-number bg-primary text-white rounded-circle me-3">{{ step.number || '•' }}</span>
                  <span>{{ step.step }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <button class="btn btn-outline-primary" @click="$router.go(-1)">
            <i class="fas fa-arrow-left me-2"></i> Back
          </button>
          <button class="btn btn-primary" @click="toggleFavorite" :disabled="isToggling">
            <i :class="isFavorite ? 'fas fa-heart text-danger' : 'far fa-heart me-2'"></i> 
            {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="!recipe" class="row justify-content-center py-5">
      <div class="col-md-6 text-center">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading recipe details...</p>
      </div>
    </div>
  </div>
</template>

<script>
import favoritesService from '../services/favoritesService';

export default {
  name: "RecipeViewPage",
  data() {
    return {
      recipe: null,
      isFavorite: false,
      isToggling: false
    };
  },
  async created() {
    try {
      const recipeId = this.$route.params.recipeId;
      let response;

      try {
        // Use the base URL from the store
        //distinguish between user recipe starts with user_ and public recipe
        if (recipeId.startsWith("user_")) {
          // Fetch user-specific recipe
          const recipe_id = recipeId.split("user_")[1];
          response = await this.axios.get(`${this.$root.store.server_domain}/users/${this.$root.store.username}/recipes/${recipe_id}`);
        } else {
          // Fetch public recipe
          response = await this.axios.get(`${this.$root.store.server_domain}/recipes/${recipeId}`);
        }
        console.log("API Response:", response.data);
        
        if (response.status !== 200) {
          this.$router.replace("/NotFound");
          return;
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        this.$router.replace("/NotFound");
        return;
      }

      // Extract the recipe data directly from the response
      const recipeData = response.data;
      
      // Extract fields from the response based on the expected format
      const {
        id,
        title = "",
        readyInMinutes = 0,
        image = "",
        popularity = 0,
        vegan = false,
        vegetarian = false,
        glutenFree = false,
        servings = 0,
        summary = "",
        ingredients = [],
        instructions = []
      } = recipeData;
      
      // Create a standardized instructions format for the template
      let _instructions = [];
      
      if (instructions && instructions.length > 0) {
        // Handle the analyzed instructions format
        _instructions = instructions
          .map(section => {
            if (section.steps && section.steps.length > 0) {
              // Add section name to first step if it exists
              const steps = [...section.steps];
              if (section.name && steps.length > 0) {
                steps[0] = {
                  ...steps[0],
                  step: section.name + ": " + steps[0].step
                };
              }
              return steps;
            }
            return [];
          })
          .flat()
          .map((step, index) => ({
            ...step,
            number: step.number || index + 1
          }));
      } else {
        // Create a simple step if no instructions are available
        _instructions = [{ 
          number: 1, 
          step: "No detailed instructions available."
        }];
      }
      
      // Create a standardized ingredients format
      const extendedIngredients = ingredients.map(ing => {
        if (typeof ing === 'string') {
          // Handle case where ingredient is just a string
          return {
            id: Math.random().toString(36).substring(7),
            original: ing
          };
        }
        // Assume it's already in the right format or has an 'original' field
        return ing;
      });

      // Create the final recipe object
      const _recipe = {
        id,
        title,
        readyInMinutes,
        image,
        aggregateLikes: popularity,
        vegan,
        vegetarian,
        glutenFree,
        servings,
        summary,
        extendedIngredients,
        _instructions,
        analyzedInstructions: instructions || []
      };

      this.recipe = _recipe;
      console.log("Recipe data processed:", this.recipe);
      
      // Save viewed recipe to localStorage
      this.saveViewedRecipe(_recipe);
      
      // Check if recipe is in favorites
      this.checkFavoriteStatus(_recipe.id);
    } catch (error) {
      console.error("Error processing recipe data:", error);
      this.$router.replace("/NotFound");
    }
  },
  methods: {
    async checkFavoriteStatus(recipeId) {
      if (!this.$root.store.username) return;
      
      try {
        const result = await favoritesService.isInFavorites(recipeId);
        this.isFavorite = result;
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    },
    
    async toggleFavorite() {
      if (!this.$root.store.username || this.isToggling) return;
      
      this.isToggling = true;
      
      try {
        if (this.isFavorite) {
          await favoritesService.removeFromFavorites(this.recipe.id);
          this.isFavorite = false;
        } else {
          await favoritesService.addToFavorites(this.recipe.id);
          this.isFavorite = true;
        }
      } catch (error) {
        console.error("Error toggling favorite status:", error);
      } finally {
        this.isToggling = false;
      }
    },
    
    saveViewedRecipe(recipe) {
      try {
        // Get existing viewed recipes from localStorage
        const viewedRecipesJSON = localStorage.getItem('viewedRecipes') || '[]';
        let viewedRecipes = JSON.parse(viewedRecipesJSON);
        
        // Ensure it's an array
        if (!Array.isArray(viewedRecipes)) {
          viewedRecipes = [];
        }
        
        // Create a simplified version of the recipe to save
        const recipeToSave = {
          id: recipe.id,
          title: recipe.title,
          readyInMinutes: recipe.readyInMinutes,
          image: recipe.image,
          aggregateLikes: recipe.aggregateLikes,
          vegan: recipe.vegan,
          vegetarian: recipe.vegetarian,
          glutenFree: recipe.glutenFree
        };
        
        // Remove this recipe if it already exists in the list
        viewedRecipes = viewedRecipes.filter(r => r.id !== recipe.id);
        
        // Add the new recipe to the beginning of the array
        viewedRecipes.unshift(recipeToSave);
        
        // Keep only the last 10 viewed recipes
        viewedRecipes = viewedRecipes.slice(0, 10);
        
        // Save back to localStorage
        localStorage.setItem('viewedRecipes', JSON.stringify(viewedRecipes));
        console.log('Recipe saved to viewed recipes:', recipe.title);
      } catch (error) {
        console.error('Error saving viewed recipe to localStorage:', error);
      }
    }
  }
};
</script>

<style scoped>
/* Font import for better typography */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
/* Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
/* Bootstrap CSS */
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css');

/* Recipe Hero Image */
.recipe-hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* Step Number Style */
.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  font-weight: bold;
  flex-shrink: 0;
}

/* Card Hover Effect */
.card {
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

/* Button Animations */
.btn {
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-outline-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Hover effect for ingredients and instructions */
.list-group-item {
  transition: background-color 0.2s;
}

.list-group-item:hover {
  background-color: rgba(26, 115, 232, 0.05);
}

/* Animation for page load */
.recipe-detail {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Adjust text sizes for better hierarchy */
.display-4 {
  font-weight: 700 !important;
  font-size: calc(1.5rem + 2.4vw) !important;
}

@media (min-width: 768px) {
  .display-4 {
    font-size: calc(1.8rem + 1.5vw) !important;
  }
}

/* Recipe summary styling */
.recipe-summary {
  line-height: 1.6;
  color: #555;
}

.recipe-summary a {
  color: #1a73e8;
  text-decoration: none;
}

.recipe-summary a:hover {
  text-decoration: underline;
}

/* Ensure ingredients list is styled properly */
.ingredients-list li {
  margin-bottom: 8px;
}

/* Add animation for the instruction steps */
.instruction-steps li {
  opacity: 0;
  animation: fadeInStep 0.5s ease forwards;
}

@keyframes fadeInStep {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
