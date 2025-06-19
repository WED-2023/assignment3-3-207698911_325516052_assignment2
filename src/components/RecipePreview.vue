<template>
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
        <span v-if="showVeganBadge" class="badge bg-success me-1">
          <i class="fas fa-seedling me-1"></i>Vegan
        </span>
        <span v-else-if="showVegetarianBadge" class="badge bg-info me-1">
          <i class="fas fa-leaf me-1"></i>Vegetarian
        </span>
        <span v-if="showGlutenFreeBadge" class="badge bg-warning text-dark me-1">
          <i class="fas fa-bread-slice me-1"></i>Gluten-Free
        </span>
        <span v-if="showDairyFreeBadge" class="badge bg-secondary me-1">
          <i class="fas fa-cheese me-1"></i>Dairy-Free
        </span>
      </div>
      
      <!-- Favorite button -->
      <button 
        v-if="isAuthenticated"
        @click.stop="toggleFavorite" 
        class="favorite-btn position-absolute top-0 end-0 m-3"
        :class="{ 'is-favorite': isFavorite }"
        :disabled="isToggling"
        :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
      >
        <i :class="favoriteIconClass"></i>
      </button>
    </div>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title fw-bold">{{ recipe.title }}</h5>
      <div class="recipe-meta mb-3">
        <span v-if="showCookingTime" class="meta-item me-3">
          <i class="far fa-clock text-primary me-1"></i> {{ formattedCookingTime }}
        </span>
        <span v-if="showLikes" class="meta-item">
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
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import favoritesService from '../services/favoritesService';
import store from '../store';

export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // Reactive state
    const isFavorite = ref(false);
    const isToggling = ref(false);
    
    // Check if user is authenticated
    const isAuthenticated = computed(() => !!store.username);
    
    // Computed properties for favorite icon
    const favoriteIconClass = computed(() => {
      if (isToggling.value) {
        return "fas fa-spinner fa-spin";
      }
      return isFavorite.value ? "fas fa-heart" : "far fa-heart";
    });
    
    // Computed properties for dietary badges
    const showVeganBadge = computed(() => props.recipe.vegan);
    const showVegetarianBadge = computed(() => props.recipe.vegetarian);
    const showGlutenFreeBadge = computed(() => props.recipe.glutenFree);
    const showDairyFreeBadge = computed(() => props.recipe.dairyFree);
    
    // Computed properties for recipe meta information
    const showCookingTime = computed(() => props.recipe.readyInMinutes);
    const formattedCookingTime = computed(() => `${props.recipe.readyInMinutes} min`);
    const showLikes = computed(() => props.recipe.aggregateLikes);
    
    // Check if recipe is in favorites
    const checkIfFavorite = async () => {
      if (!isAuthenticated.value) return;
      
      try {
        const result = await favoritesService.isInFavorites(props.recipe.id);
        isFavorite.value = result;
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    
    // Toggle favorite status
    const toggleFavorite = async (event) => {
      event.preventDefault(); // Prevent navigation when clicking the favorite button
      
      if (!isAuthenticated.value || isToggling.value) return;
      
      isToggling.value = true;
      
      try {
        if (isFavorite.value) {
          await favoritesService.removeFromFavorites(props.recipe.id);
          isFavorite.value = false;
        } else {
          await favoritesService.addToFavorites(props.recipe.id);
          isFavorite.value = true;
        }
      } catch (error) {
        console.error("Error toggling favorite status:", error);
      } finally {
        isToggling.value = false;
      }
    };
    
    // Method to handle image loading errors
    const handleImageError = (e) => {
      console.error(`Failed to load image: ${props.recipe.image}`);
      // Fallback to a placeholder
      e.target.src = 'https://via.placeholder.com/300x200?text=Recipe+Image+Not+Available';
    };
    
    onMounted(checkIfFavorite);
    
    return {
      isAuthenticated,
      isFavorite,
      isToggling,
      favoriteIconClass,
      toggleFavorite,
      showVeganBadge,
      showVegetarianBadge,
      showGlutenFreeBadge,
      showDairyFreeBadge,
      showCookingTime,
      formattedCookingTime,
      showLikes,
      handleImageError
    };
  }
}
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

.card-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.5rem;
}

/* Favorite button styles */
.favorite-btn {
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn i {
  font-size: 1.2rem;
  color: #dc3545;
  transition: all 0.3s ease;
}

.favorite-btn.is-favorite i {
  color: #dc3545;
}

.favorite-btn:not(.is-favorite) i {
  color: #6c757d;
}

.favorite-btn:hover i {
  color: #dc3545;
}
</style>
