<template>
  <div class="container">
    <div class="not-found-container">
      <div class="not-found-icon">404</div>
      <h1 class="title">Page Not Found</h1>
      <p class="subtitle">Oops! The page you're looking for doesn't exist.</p>
      <router-link to="/" class="home-button">
        <i class="fas fa-home"></i> Return to Home
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFoundPage"
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
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-container {
  text-align: center;
  padding: 60px 20px;
}

.not-found-icon {
  font-size: 8rem;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 20px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.home-button {
  display: inline-block;
  padding: 12px 24px;
  background-color: #1a73e8;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s;
}

.home-button:hover {
  background-color: #0d62c9;
}
</style>
