<template>
  <div class="container py-5">
    <div class="row mb-5">
      <div class="col-12 text-center">
        <h1 class="display-4 fw-bold text-primary">My Favorite Recipes</h1>
        <p class="lead text-muted">All your saved favorite recipes in one place</p>
      </div>
    </div>
    
    <!-- Favorites Filter and Search -->
    <div class="row mb-4">
      <div class="col-md-8 mx-auto">
        <div class="input-group">
          <span class="input-group-text bg-white border-end-0">
            <i class="fas fa-search text-muted"></i>
          </span>
          <input 
            type="text" 
            class="form-control border-start-0" 
            placeholder="Search your favorites..." 
            v-model="searchQuery"
            @input="filterFavorites"
          >
          <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Filter
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><button class="dropdown-item" @click="applyFilter('all')">All Recipes</button></li>
            <li><button class="dropdown-item" @click="applyFilter('vegetarian')">Vegetarian</button></li>
            <li><button class="dropdown-item" @click="applyFilter('vegan')">Vegan</button></li>
            <li><button class="dropdown-item" @click="applyFilter('gluten-free')">Gluten Free</button></li>
            <li><button class="dropdown-item" @click="applyFilter('dairy-free')">Dairy Free</button></li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Favorites List -->
    <div v-if="filteredFavorites.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="recipe in filteredFavorites" :key="recipe.id">
        <div class="card h-100 recipe-card border-0 shadow-sm">
          <div class="position-relative overflow-hidden recipe-image-wrapper">
            <img
              v-if="recipe.image"
              :src="recipe.image"
              class="card-img-top recipe-image"
              :alt="recipe.title"
              @error="handleImageError"
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
              <span v-if="recipe.dairyFree" class="badge bg-secondary me-1">
                <i class="fas fa-cheese me-1"></i>Dairy-Free
              </span>
            </div>
            
            <!-- Remove from favorites button -->
            <button 
              @click.stop="removeFromFavorites(recipe.id)" 
              class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
              title="Remove from favorites"
            >
              <i class="fas fa-times"></i>
            </button>
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
            <router-link 
              :to="{ name: 'recipe', params: { recipeId: recipe.id } }" 
              class="btn btn-primary mt-auto">
              View Recipe Details
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="!isLoading" class="row justify-content-center mb-5">
      <div class="col-md-8 text-center py-5">
        <div class="no-favorites-icon mb-4">
          <i class="far fa-heart fa-4x text-muted"></i>
        </div>
        <h3 class="h4 mb-3">No favorite recipes yet</h3>
        <p class="text-muted mb-4">Start exploring recipes and click the heart icon to add them to your favorites.</p>
        <router-link to="/search" class="btn btn-primary">
          <i class="fas fa-search me-2"></i> Find Recipes
        </router-link>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-else class="row justify-content-center mb-5">
      <div class="col-md-8 text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Loading your favorite recipes...</p>
      </div>
    </div>
    
    <!-- Back to Dashboard -->
    <div class="row mt-5">
      <div class="col-12 text-center">
        <router-link to="/dashboard" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i> Back to Dashboard
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import favoritesService from '../services/favoritesService';

export default {
  name: 'FavoritesPage',
  setup() {
    const router = useRouter();
    const store = window.store;
    
    // Reactive data
    const favorites = ref([]);
    const filteredFavorites = ref([]);
    const isLoading = ref(true);
    const searchQuery = ref('');
    const activeFilter = ref('all');
      // Fetch favorites from API
    const fetchFavorites = async () => {
      if (!store.username) {
        router.push('/login');
        return;
      }
      
      isLoading.value = true;
      
      try {
        // Call the API service to get favorites
        const favoritesData = await favoritesService.getFavorites();
        
        if (Array.isArray(favoritesData)) {
          favorites.value = favoritesData;
          filteredFavorites.value = [...favoritesData];
          console.log("Fetched favorites:", favorites.value);
        } else {
          console.error("Invalid favorites data format:", favoritesData);
          favorites.value = [];
          filteredFavorites.value = [];
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        favorites.value = [];
        filteredFavorites.value = [];
        
        // Show error notification if needed
        // You could add a notification system here
      } finally {
        isLoading.value = false;
      }
    };
    
    // Filter favorites based on search query and active filter
    const filterFavorites = () => {
      let results = [...favorites.value];
      
      // Apply search query filter
      if (searchQuery.value.trim() !== '') {
        const query = searchQuery.value.toLowerCase();
        results = results.filter(recipe => 
          recipe.title.toLowerCase().includes(query)
        );
      }
      
      // Apply dietary filter
      if (activeFilter.value !== 'all') {
        switch(activeFilter.value) {
          case 'vegetarian':
            results = results.filter(recipe => recipe.vegetarian);
            break;
          case 'vegan':
            results = results.filter(recipe => recipe.vegan);
            break;
          case 'gluten-free':
            results = results.filter(recipe => recipe.glutenFree);
            break;
          case 'dairy-free':
            results = results.filter(recipe => recipe.dairyFree);
            break;
        }
      }
      
      filteredFavorites.value = results;
    };
    
    // Apply filter and update active filter
    const applyFilter = (filter) => {
      activeFilter.value = filter;
      filterFavorites();
    };
      // Remove recipe from favorites
    const removeFromFavorites = async (recipeId) => {
      try {
        // Call the API service to remove from favorites
        await favoritesService.removeFromFavorites(recipeId);
        
        // Update local state
        favorites.value = favorites.value.filter(recipe => recipe.id !== recipeId);
        filterFavorites(); // Update filtered list
        
        // Optional: Show success notification
        console.log(`Recipe ${recipeId} removed from favorites`);
      } catch (error) {
        console.error(`Error removing recipe ${recipeId} from favorites:`, error);
        // Optional: Show error notification
      }
    };
    
    // Handle image loading errors
    const handleImageError = (e) => {
      e.target.src = 'https://via.placeholder.com/300x200?text=Recipe+Image+Not+Available';
    };
    
    onMounted(() => {
      fetchFavorites();
    });
    
    return {
      favorites,
      filteredFavorites,
      isLoading,
      searchQuery,
      activeFilter,
      filterFavorites,
      applyFilter,
      removeFromFavorites,
      handleImageError
    };
  }
};
</script>

<style scoped>
.recipe-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.recipe-card:hover {
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
  bottom: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
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
  display: flex;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
}

.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.5rem;
}

.divider {
  width: 60px;
  height: 4px;
  background-color: #1a73e8;
  margin: 15px auto;
  border-radius: 2px;
}

.no-favorites-icon {
  opacity: 0.5;
}
</style>
