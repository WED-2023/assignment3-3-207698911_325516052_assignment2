<template>
  <div class="container">
    <div v-if="recipe" class="recipe-detail">
      <div class="recipe-header">
        <h1 class="title">{{ recipe.title }}</h1>
        <div class="recipe-meta">
          <span class="meta-item">
            <i class="far fa-clock"></i> Ready in {{ recipe.readyInMinutes }} minutes
          </span>
          <span class="meta-item">
            <i class="far fa-heart"></i> {{ recipe.aggregateLikes }} likes
          </span>
        </div>
      </div>
      
      <div class="recipe-image-container">
        <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" class="recipe-image" />
        <div v-else class="recipe-image-placeholder">
          <i class="fas fa-utensils"></i>
        </div>
      </div>
      
      <div class="recipe-content">
        <div class="recipe-section ingredients-section">
          <h2 class="section-title"><i class="fas fa-list"></i> Ingredients</h2>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in recipe.extendedIngredients" 
                :key="index + '_' + ingredient.id" 
                class="ingredient-item">
              {{ ingredient.original }}
            </li>
          </ul>
        </div>
        
        <div class="recipe-section instructions-section">
          <h2 class="section-title"><i class="fas fa-tasks"></i> Instructions</h2>
          <ol class="instructions-list">
            <li v-for="step in recipe._instructions" 
                :key="step.number" 
                class="instruction-step">
              {{ step.step }}
            </li>
          </ol>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="action-button back-button" @click="$router.go(-1)">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button class="action-button save-button">
          <i class="far fa-bookmark"></i> Save Recipe
        </button>
      </div>
    </div>
    
    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading recipe details...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeViewPage",
  data() {
    return {
      recipe: null
    };
  },
  async created() {
    try {
      let response;
      // response = this.$route.params.response;

      try {
        response = await this.axios.get(
          // "https://test-for-3-2.herokuapp.com/recipes/info",
          this.$root.store.server_domain + "/recipes/info",
          {
            params: { id: this.$route.params.recipeId }
          }
        );

        // console.log("response.status", response.status);
        if (response.status !== 200) this.$router.replace("/NotFound");
      } catch (error) {
        console.log("error.response.status", error.response.status);
        this.$router.replace("/NotFound");
        return;
      }

      let {
        analyzedInstructions,
        instructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title
      } = response.data.recipe;

      let _instructions = analyzedInstructions
        .map((fstep) => {
          fstep.steps[0].step = fstep.name + fstep.steps[0].step;
          return fstep.steps;
        })
        .reduce((a, b) => [...a, ...b], []);

      let _recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes,
        readyInMinutes,
        image,
        title
      };

      this.recipe = _recipe;
    } catch (error) {
      console.log(error);
    }
  }
};
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

/* Recipe Header */
.recipe-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 15px;
}

.recipe-meta {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.meta-item i {
  margin-right: 8px;
  color: #1a73e8;
}

/* Recipe Image */
.recipe-image-container {
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 0 auto 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f5ff;
  color: #1a73e8;
  font-size: 5rem;
}

/* Recipe Content */
.recipe-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.recipe-section {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.section-title i {
  margin-right: 10px;
  color: #1a73e8;
}

/* Ingredients */
.ingredients-list {
  list-style-type: none;
  padding: 0;
}

.ingredient-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  position: relative;
  padding-left: 25px;
}

.ingredient-item:before {
  content: "•";
  color: #1a73e8;
  font-size: 1.5rem;
  position: absolute;
  left: 0;
  top: 5px;
}

.ingredient-item:last-child {
  border-bottom: none;
}

/* Instructions */
.instructions-list {
  padding-left: 20px;
}

.instruction-step {
  margin-bottom: 15px;
  line-height: 1.6;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.action-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: none;
  transition: all 0.3s;
}

.action-button i {
  margin-right: 8px;
}

.back-button {
  background-color: #f0f0f0;
  color: #555;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.save-button {
  background-color: #1a73e8;
  color: white;
}

.save-button:hover {
  background-color: #0d62c9;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
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

/* Responsive Design */
@media (max-width: 768px) {
  .recipe-image-container {
    height: 300px;
  }
  
  .title {
    font-size: 2.2rem;
  }
  
  .recipe-content {
    flex-direction: column;
  }
}
</style>
