<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col-12 text-center">
        <h1 class="display-4 fw-bold text-primary">Welcome Back, {{ store.username }}!</h1>
        <p class="lead text-muted">Your personalized recipe dashboard</p>
      </div>
    </div>
    
    <!-- User Stats Card -->
    <div class="row mb-5">
      <div class="col-md-10 mx-auto">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <div class="row g-4">              <div class="col-md-4">
                <div class="user-stat text-center">
                  <i class="fas fa-eye text-primary stat-icon mb-3"></i>
                  <h3 class="h2 fw-bold">{{ viewedRecipes.length }}</h3>
                  <p class="text-muted">Recipes Viewed</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="user-stat text-center">
                  <i class="fas fa-heart text-danger stat-icon mb-3"></i>
                  <h3 class="h2 fw-bold">{{ favoriteRecipes.length }}</h3>
                  <p class="text-muted">Favorite Recipes</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="user-stat text-center">
                  <i class="fas fa-list text-success stat-icon mb-3"></i>
                  <h3 class="h2 fw-bold">{{ myCollections.length }}</h3>
                  <p class="text-muted">My Collections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            </router-link>
          </div>
          <div class="col-md-4">
            <router-link to="/meal-planner" class="quick-action-card card border-0 shadow-sm h-100">
              <div class="card-body text-center p-4">
                <i class="fas fa-calendar-week action-icon text-success mb-3"></i>
                <h3 class="h5 fw-bold">Meal Planner</h3>
                <p class="text-muted small">Plan your meals for the week</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>    </div>
    
    <!-- Recently Viewed Recipes -->
    <div class="row">
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
                <h5 class="card-title fw-bold">{{ recipe.title }}</h5>
                <div class="recipe-meta mb-3">
                  <span v-if="recipe.readyInMinutes" class="meta-item me-3">
                    <i class="far fa-clock text-primary me-1"></i> {{ recipe.readyInMinutes }} min
                  </span>
                  <span v-if="recipe.aggregateLikes" class="meta-item">
                    <i class="far fa-heart text-danger me-1"></i> {{ recipe.aggregateLikes }}
                  </span>
                </div>
                <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }" class="btn btn-primary mt-auto">
                  View Recipe Details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import favoritesService from '../services/favoritesService';

export default {
  name: 'DashboardPage',
  data() {
    return {
      viewedRecipes: [],
      favoriteRecipes: [],
      myCollections: []
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
      
      // Mock viewed recipes
      this.viewedRecipes = [
        {
          id: 1,
          title: "Homemade Pizza",
          readyInMinutes: 45,
          image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
          aggregateLikes: 220,
          vegetarian: true,
          vegan: false,
          glutenFree: false
        },
        {
          id: 2,
          title: "Spinach and Mushroom Lasagna",
          readyInMinutes: 60,
          image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
          aggregateLikes: 158,
          vegetarian: true,
          vegan: false,
          glutenFree: false
        },
        {
          id: 3,
          title: "Grilled Salmon with Avocado Salsa",
          readyInMinutes: 30,
          image: "https://spoonacular.com/recipeImages/716426-312x231.jpg",
          aggregateLikes: 175,
          vegetarian: false,
          vegan: false,
          glutenFree: true
        }
      ];
      
      // Mock favorite recipes
      this.favoriteRecipes = [
        {
          id: 2,
          title: "Spinach and Mushroom Lasagna"
        },
        {
          id: 4,
          title: "Chocolate Chip Cookies"
        }
      ];
      
      // Mock collections
      this.myCollections = [
        { id: 1, name: "Weeknight Dinners" },
        { id: 2, name: "Healthy Breakfast" }      ];
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

.stat-icon, .action-icon {
  font-size: 2.5rem;
  display: block;
}

.user-stat {
  padding: 15px;
  transition: transform 0.3s ease;
}

.user-stat:hover {
  transform: translateY(-5px);
}

.quick-action-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.quick-action-card:hover {
  transform: translateY(-5px);  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
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
</style>
