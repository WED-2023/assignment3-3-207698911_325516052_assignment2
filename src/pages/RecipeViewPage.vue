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
                <li v-for="step in recipe._instructions" 
                    :key="step.number" 
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
          <button class="btn btn-primary">
            <i class="far fa-bookmark me-2"></i> Save Recipe
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

      try {
        response = await this.axios.get(
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

      // Handle different response structures (from API vs from "Surprise Me")
      let recipeData = response.data.recipe || response.data;
      
      let {
        analyzedInstructions = [],
        instructions = "",
        extendedIngredients = [],
        aggregateLikes = 0,
        readyInMinutes = 0,
        image = "",
        title = "",
        vegan = false,
        vegetarian = false,
        glutenFree = false
      } = recipeData;

      // If the response is from our random API, we might need to adjust
      if (!analyzedInstructions || analyzedInstructions.length === 0) {
        // Create a simple instruction step if missing
        analyzedInstructions = [{
          name: "Instructions: ",
          steps: [{ step: instructions || "No detailed instructions available." }]
        }];
      }

      let _instructions = analyzedInstructions
        .map((fstep) => {
          if (fstep.steps && fstep.steps.length > 0) {
            fstep.steps[0].step = (fstep.name || "") + fstep.steps[0].step;
          }
          return fstep.steps || [];
        })
        .reduce((a, b) => [...a, ...b], []);

      // If no extended ingredients but we have simple ingredients
      if ((!extendedIngredients || extendedIngredients.length === 0) && recipeData.ingredients) {
        extendedIngredients = recipeData.ingredients.map(ing => ({
          original: ing,
          id: Math.random().toString(36).substring(7)
        }));
      }

      let _recipe = {
        instructions,
        _instructions,
        analyzedInstructions,
        extendedIngredients,
        aggregateLikes: aggregateLikes || recipeData.popularity || 0,
        readyInMinutes,
        image,
        title,
        vegan,
        vegetarian, 
        glutenFree
      };

      this.recipe = _recipe;
      console.log("Recipe data processed:", this.recipe);
    } catch (error) {
      console.log("Error processing recipe data:", error);
      this.$router.replace("/NotFound");
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
</style>
