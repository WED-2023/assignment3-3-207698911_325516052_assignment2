<template>
  <div class="container">
    <h3 v-if="title" class="mb-4 text-center">
      {{ title }}
      <slot></slot>
    </h3>
    
    <div v-if="recipes.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>
    
    <div v-else-if="loading" class="row justify-content-center mb-5">
      <div class="col-md-8 text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted">Finding the perfect recipes for you...</p>
      </div>
    </div>
    
    <div v-else class="row justify-content-center mb-5">
      <div class="col-md-8 text-center py-5">
        <div class="no-results-icon mb-3">🍽️</div>
        <h3 class="h4 mb-3">No recipes found</h3>
        <p class="text-muted">Please try again later</p>
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";
export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview
  },
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      recipes: [],
      loading: false,
      error: null
    };
  },
  mounted() {
    if (!this.disabled) {
      this.updateRecipes();
    }
  },
  methods: {
    async updateRecipes() {
      this.loading = true;
      this.error = null;
      
      try {
        const apiUrl = `${this.$root.store.server_domain}/recipes/random`;
        console.log("Fetching recipes from:", apiUrl);
        
        // Check if axios is available
        if (!this.axios) {
          console.error("Axios is not available on the component");
          // Try to use global axios
          if (window.axios) {
            console.log("Using window.axios instead");
            const response = await window.axios.get(apiUrl);
            this.processApiResponse(response);
          } else {
            console.error("No axios instance available");
          }
          return;
        }
        
        const response = await this.axios.get(apiUrl);
        this.processApiResponse(response);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        this.error = error.message || "Failed to fetch recipes";
        
        // For testing/debugging - add some mock recipes if API fails
        this.addMockRecipes();
      } finally {
        this.loading = false;
      }
    },
    
    processApiResponse(response) {
      console.log("API Response:", response);
      
      // Check for valid response structure
      if (!response || !response.data) {
        console.error("Invalid API response:", response);
        return;
      }
      
      // Try different possible response structures
      let recipesArray = null;
      
      if (response.data.recipes && Array.isArray(response.data.recipes)) {
        console.log("Found recipes in response.data.recipes");
        recipesArray = response.data.recipes;
      } else if (Array.isArray(response.data)) {
        console.log("Response data is directly an array");
        recipesArray = response.data;
      } else if (response.data.results && Array.isArray(response.data.results)) {
        console.log("Found recipes in response.data.results");
        recipesArray = response.data.results;
      } else {
        console.error("Could not find recipes array in response:", response.data);
        // For testing/debugging - add some mock data if response structure is unexpected
        this.addMockRecipes();
        return;
      }
      
      if (recipesArray.length === 0) {
        console.warn("Received empty recipes array");
        return;
      }
      
      const recipes = recipesArray.map((r) => {
        const recipe = {
          id: r.id || Math.floor(Math.random() * 10000),
          title: r.title || "Untitled Recipe",
          readyInMinutes: r.readyInMinutes || 0,
          image: r.image || "",
          aggregateLikes: r.aggregateLikes || 0,
          vegetarian: r.vegetarian || false,
          vegan: r.vegan || false,
          glutenFree: r.glutenFree || false,
          dairyFree: r.dairyFree || false
        };
        console.log("Processed recipe:", recipe);
        return recipe;
      });
      
      console.log("All processed recipes:", recipes);
      
      this.recipes = recipes;
      console.log("Final recipes array:", this.recipes);
    },
    
    addMockRecipes() {
      console.log("Adding mock recipes for testing");
      this.recipes = [
        {
          id: 1,
          title: "Spaghetti Carbonara",
          readyInMinutes: 30,
          image: "https://spoonacular.com/recipeImages/715538-312x231.jpg",
          aggregateLikes: 42,
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          dairyFree: false
        },
        {
          id: 2,
          title: "Chicken Parmesan",
          readyInMinutes: 45,
          image: "https://spoonacular.com/recipeImages/716429-312x231.jpg", 
          aggregateLikes: 36,
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          dairyFree: false
        },
        {
          id: 3,
          title: "Vegetable Stir Fry",
          readyInMinutes: 20,
          image: "https://spoonacular.com/recipeImages/716429-312x231.jpg",
          aggregateLikes: 28,
          vegetarian: true,
          vegan: true,
          glutenFree: true,
          dairyFree: true
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 400px;
}

.no-results-icon {
  font-size: 3rem;
}

/* Smooth animations */
.row {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding: 0 10px;
  }
}
</style>
