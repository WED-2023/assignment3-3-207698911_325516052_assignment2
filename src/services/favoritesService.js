import axios from 'axios';
import store from '../store';

const API_BASE_URL = store.server_domain;

export default {
  /**
   * Fetch the user's favorite recipes
   * @returns {Promise<Array>} Array of favorite recipes
   */
  async getFavorites() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/${store.username}/favorites`,
        { withCredentials: true }
      );
      
      console.log("Fetched favorites:", response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },
  
  /**
   * Add a recipe to the user's favorites
   * @param {number} recipeId - The ID of the recipe to add to favorites
   * @returns {Promise<Object>} Response from the server
   */
  async addToFavorites(recipeId) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/${store.username}/favorites`,
        { recipeId },
        { withCredentials: true }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },
  
  /**
   * Remove a recipe from the user's favorites
   * @param {number} recipeId - The ID of the recipe to remove from favorites
   * @returns {Promise<Object>} Response from the server
   */
  async removeFromFavorites(recipeId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/users/${store.username}/favorites/${recipeId}`,
        { withCredentials: true }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },
  
  /**
   * Check if a recipe is in the user's favorites
   * @param {number} recipeId - The ID of the recipe to check
   * @param {Array} favorites - The user's favorite recipes (optional)
   * @returns {Promise<boolean>} True if the recipe is in favorites
   */
  async isInFavorites(recipeId, favorites = null) {
    try {
      if (favorites) {
        return favorites.some(recipe => recipe.id === recipeId);
      }
      
      const userFavorites = await this.getFavorites();
      return userFavorites.some(recipe => recipe.id === recipeId);
    } catch (error) {
      console.error('Error checking if in favorites:', error);
      return false;
    }
  }
};
