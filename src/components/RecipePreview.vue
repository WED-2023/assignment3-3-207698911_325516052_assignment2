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
</template>

<script>
export default {
  name: "RecipePreview",
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleImageError(e) {
      console.error(`Failed to load image: ${this.recipe.image}`);
      // Fallback to a placeholder
      e.target.src = 'https://via.placeholder.com/300x200?text=Recipe+Image+Not+Available';
    }
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
</style>
