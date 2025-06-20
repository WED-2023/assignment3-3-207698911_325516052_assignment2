/**
 * Service for handling user recipe-related API calls
 */
import axios from 'axios';
import store from '../store';

const API_BASE_URL = store.server_domain;

export default {
  /**
   * Get all personal recipes for a user
   * @returns {Promise<Array>} Array of recipe objects
   */
  async getUserRecipes() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${store.username}/recipes`,
        { withCredentials: true }
      );

      console.log("Fetched user recipes:", response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      throw error;
    }
  },
    /**
   * Create a new recipe for the user
   * @param {number} userId - The ID of the user
   * @param {Object} recipeData - Recipe data to be created
   * @returns {Promise<Object>} Created recipe object with ID assigned by the server
   */
  async createRecipe(userId, recipeData) {
    try {
      // Transform the recipe data to match backend expectations
      const transformedData = {
        title: recipeData.title,
        image: recipeData.image || null,
        readyInMinutes: recipeData.readyInMinutes || null,
        servings: recipeData.servings || null,
        instructions: recipeData.analyzedInstructions[0].steps,
        ingredients: recipeData.extendedIngredients.map(ing => ({
          name: ing.name,
          amount: ing.amount,
          unit: ing.unit
        })),
        is_vegetarian: recipeData.vegetarian || false,
        is_vegan: recipeData.vegan || false,
        is_gluten_free: recipeData.glutenFree || false
      };
      
      console.log("Sending recipe data:", transformedData);
      
      const response = await axios.post(
        `${API_BASE_URL}/users/${store.username}/recipes`,
        transformedData,
        { withCredentials: true }
      );
      
      console.log("Created recipe response:", response.data);
      
      // If the response contains just the recipe_id, construct a full recipe object
      if (response.data && response.data.recipe_id) {
        const createdRecipe = {
          id: response.data.recipe_id,
          recipe_id: response.data.recipe_id,
          title: recipeData.title,
          image: recipeData.image,
          readyInMinutes: recipeData.readyInMinutes,
          servings: recipeData.servings,
          vegetarian: recipeData.vegetarian,
          vegan: recipeData.vegan,
          glutenFree: recipeData.glutenFree,
          // Include other fields as needed
        };
        return createdRecipe;
      }
      
      return response.data; 
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }
};
