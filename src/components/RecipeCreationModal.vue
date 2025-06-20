<template>
  <div class="recipe-creation-modal">
    <div class="modal fade" id="recipeCreationModal" tabindex="-1" aria-labelledby="recipeCreationModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="recipeCreationModalLabel">Create New Recipe</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitRecipe" class="recipe-form">
              <!-- Basic Info Section -->
              <div class="mb-4">
                <h6 class="form-section-title">Basic Information</h6>
                
                <div class="mb-3">
                  <label for="recipeTitle" class="form-label">Recipe Title <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="recipeTitle" v-model="recipe.title" required placeholder="e.g., Homemade Margherita Pizza">
                </div>
                
                <div class="row g-3">
                  <div class="col-md-6">
                    <label for="recipeImage" class="form-label">Image URL</label>
                    <input type="url" class="form-control" id="recipeImage" v-model="recipe.image" placeholder="https://example.com/image.jpg">
                    <small class="text-muted">Provide a link to an image of your dish</small>
                  </div>
                  <div class="col-md-6">
                    <label for="recipeTime" class="form-label">Preparation Time (minutes) <span class="text-danger">*</span></label>
                    <input type="number" class="form-control" id="recipeTime" v-model="recipe.readyInMinutes" required min="1" placeholder="e.g., 45">
                  </div>
                </div>
              </div>
              
              <!-- Dietary Information -->
              <div class="mb-4">
                <h6 class="form-section-title">Dietary Information</h6>
                <div class="row g-3">
                  <div class="col-md-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="vegetarian" v-model="recipe.vegetarian">
                      <label class="form-check-label" for="vegetarian">Vegetarian</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="vegan" v-model="recipe.vegan">
                      <label class="form-check-label" for="vegan">Vegan</label>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="glutenFree" v-model="recipe.glutenFree">
                      <label class="form-check-label" for="glutenFree">Gluten Free</label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Ingredients Section -->
              <div class="mb-4">
                <h6 class="form-section-title">Ingredients <span class="text-danger">*</span></h6>
                <div v-for="(ingredient, index) in recipe.extendedIngredients" :key="'ing-'+index" class="input-group mb-2">
                  <input type="text" class="form-control" v-model="ingredient.name" placeholder="Ingredient name" required>
                  <input type="text" class="form-control" v-model="ingredient.amount" placeholder="Amount" required>
                  <input type="text" class="form-control" v-model="ingredient.unit" placeholder="Unit (e.g., cup, tbsp)">
                  <button type="button" class="btn btn-outline-danger" @click="removeIngredient(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="addIngredient">
                  <i class="fas fa-plus me-1"></i> Add Ingredient
                </button>
              </div>
              
              <!-- Instructions Section -->
              <div class="mb-4">
                <h6 class="form-section-title">Instructions <span class="text-danger">*</span></h6>
                <div v-for="(step, index) in recipe.analyzedInstructions[0].steps" :key="'step-'+index" class="input-group mb-2">
                  <span class="input-group-text">Step {{ index + 1 }}</span>
                  <textarea class="form-control" v-model="step.step" rows="2" placeholder="Describe this step" required></textarea>
                  <button type="button" class="btn btn-outline-danger" @click="removeStep(index)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm" @click="addStep">
                  <i class="fas fa-plus me-1"></i> Add Step
                </button>
              </div>
                <!-- Additional Information -->
              <div class="mb-4">
                <h6 class="form-section-title">Additional Information</h6>
                <div class="row g-3">
                  <div class="col-md-12">
                    <label for="recipeServings" class="form-label">Servings</label>
                    <input type="number" class="form-control" id="recipeServings" v-model="recipe.servings" min="1" placeholder="e.g., 4">
                  </div>
                </div>
              </div>
              
              <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="submitRecipe" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
              {{ isSubmitting ? 'Creating...' : 'Create Recipe' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue';
import userRecipesService from '../services/userRecipesService';
import * as bootstrap from 'bootstrap';

export default {
  name: 'RecipeCreationModal',
  data() {
    return {
      isSubmitting: false,
      errorMessage: '',
      recipe: {
        title: '',
        image: '',
        readyInMinutes: null,
        servings: 4,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        extendedIngredients: [
          { name: '', amount: '', unit: '' }
        ],
        analyzedInstructions: [
          {
            name: '',
            steps: [
              { number: 1, step: '' }
            ]
          }
        ]
      }
    };
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const toast = internalInstance.appContext.config.globalProperties.toast;
    
    return { store, toast };
  },
  methods: {
    resetForm() {
      this.recipe = {
        title: '',
        image: '',
        readyInMinutes: null,
        servings: 4,
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        extendedIngredients: [
          { name: '', amount: '', unit: '' }
        ],
        analyzedInstructions: [
          {
            name: '',
            steps: [
              { number: 1, step: '' }
            ]
          }
        ]
      };
      this.errorMessage = '';
    },
    
    addIngredient() {
      this.recipe.extendedIngredients.push({ name: '', amount: '', unit: '' });
    },
    
    removeIngredient(index) {
      if (this.recipe.extendedIngredients.length > 1) {
        this.recipe.extendedIngredients.splice(index, 1);
      }
    },
    
    addStep() {
      const nextNumber = this.recipe.analyzedInstructions[0].steps.length + 1;
      this.recipe.analyzedInstructions[0].steps.push({ number: nextNumber, step: '' });
    },
    
    removeStep(index) {
      if (this.recipe.analyzedInstructions[0].steps.length > 1) {
        this.recipe.analyzedInstructions[0].steps.splice(index, 1);
        
        // Renumber steps
        this.recipe.analyzedInstructions[0].steps.forEach((step, i) => {
          step.number = i + 1;
        });
      }
    },
    
    async submitRecipe() {
      // Validate form
      if (!this.recipe.title) {
        this.errorMessage = 'Recipe title is required';
        return;
      }
      
      if (!this.recipe.readyInMinutes) {
        this.errorMessage = 'Preparation time is required';
        return;
      }
      
      // Validate ingredients
      const invalidIngredient = this.recipe.extendedIngredients.find(ing => !ing.name || !ing.amount);
      if (invalidIngredient) {
        this.errorMessage = 'All ingredients must have a name and amount';
        return;
      }
      
      // Validate steps
      const invalidStep = this.recipe.analyzedInstructions[0].steps.find(step => !step.step);
      if (invalidStep) {
        this.errorMessage = 'All instruction steps must have a description';
        return;
      }
      
      this.isSubmitting = true;
      this.errorMessage = '';
      
      try {
        // Create recipe in database
        const createdRecipe = await userRecipesService.createRecipe(
          this.store.userId, 
          this.recipe
        );
        
        // Show success notification
        this.toast('Recipe Created', 'Your recipe was successfully created!', 'success');
        
        // Close the modal
        const modalElement = document.getElementById('recipeCreationModal');
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        bsModal.hide();
        
        // Reset form
        this.resetForm();
        
        // Emit event to refresh recipes
        this.$emit('recipe-created', createdRecipe);
      } catch (error) {
        this.errorMessage = error.message || 'Failed to create recipe. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    
    show() {
      const modalElement = document.getElementById('recipeCreationModal');
      const bsModal = new bootstrap.Modal(modalElement);
      bsModal.show();
    }
  }
};
</script>

<style scoped>
.form-section-title {
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  color: #333;
}

.recipe-form {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.recipe-form::-webkit-scrollbar {
  width: 6px;
}

.recipe-form::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.recipe-form::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.recipe-form::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
