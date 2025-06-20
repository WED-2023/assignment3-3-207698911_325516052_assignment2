<template>
  <div class="container about-page">
    <div class="row">
      <div class="col-12 text-center mb-5">
        <h1 class="display-4 fw-bold text-primary">About Us</h1>
        <p class="lead text-muted">The team behind Recipe Explorer</p>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-lg-10 mx-auto">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 class="h3 fw-bold mb-4">Our Project</h2>
            <p class="mb-3">
              Recipe Explorer is a comprehensive recipe management application developed as part of the Web Environments Development course 2025 at Ben Gurion University of the Negev, Department of Software and Information Systems Engineering.
            </p>
            <p class="mb-3">
              This platform allows users to discover, save, and manage recipes from around the world. With features like personalized dashboards, family recipes collection, and intuitive search functionality, Recipe Explorer brings the joy of cooking to everyone's kitchen.
            </p>
            <p>
              Our application emphasizes user experience, responsive design, and modern web development practices, showcasing the skills acquired throughout the course.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-lg-10 mx-auto">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 class="h3 fw-bold mb-4">Development Team</h2>
            
            <div class="row g-4">
              <div class="col-md-6">
                <div class="team-member text-center">
                  <div class="avatar-circle large mx-auto mb-3 bg-primary text-white">
                    <span class="initials">GA</span>
                  </div>
                  <h3 class="h4 fw-bold">Guy Amzaleg</h3>
                  <p class="text-muted mb-3">Software Engineering Student</p>
                  <p class="mb-3">
                    Specializing in front-end development with a passion for creating intuitive and visually appealing user interfaces.
                  </p>
                  <div class="social-links">
                    <a href="#" class="social-link">
                      <i class="fab fa-github"></i>
                    </a>
                    <a href="#" class="social-link">
                      <i class="fab fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="team-member text-center">
                  <div class="avatar-circle large mx-auto mb-3 bg-primary text-white">
                    <span class="initials">DZ</span>
                  </div>
                  <h3 class="h4 fw-bold">Dan Zaslavski</h3>
                  <p class="text-muted mb-3">Software Engineering Student</p>
                  <p class="mb-3">
                    Focused on back-end architecture and database design with a strong interest in building scalable web applications.
                  </p>
                  <div class="social-links">
                    <a href="#" class="social-link">
                      <i class="fab fa-github"></i>
                    </a>
                    <a href="#" class="social-link">
                      <i class="fab fa-linkedin"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-lg-10 mx-auto">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4">
            <h2 class="h3 fw-bold mb-4">Previous Projects</h2>
            <p class="mb-4">Check out our previous assignments from the Web Environments Development course:</p>
            
            <div class="row g-4">
              <div class="col-md-4">
                <div class="card h-100 previous-project">
                  <div class="card-body">
                    <h3 class="h5 fw-bold">Assignment 1</h3>
                    <p class="text-muted small mb-3">HTML, CSS & Responsive Design</p>
                    <p class="mb-3">Static website showcasing fundamental web development skills and responsive design principles.</p>
                    <a href="#" class="btn btn-outline-primary btn-sm">View Project</a>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">                <div class="card h-100 previous-project">
                  <div class="card-body">
                    <h3 class="h5 fw-bold">Assignment 2: Starships Game</h3>
                    <p class="text-muted small mb-3">JavaScript & Web-based Arcade Game</p>
                    <p class="mb-3">A dynamic web-based arcade game combining modern aesthetics, engaging gameplay mechanics, and responsive design to create an immersive experience.</p>
                    <a href="https://wed-2023.github.io/assignment2-207698911_325516052_assignment2/" target="_blank" class="btn btn-outline-primary btn-sm">Play Game</a>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">                <div class="card h-100 previous-project">
                  <div class="card-body">
                    <h3 class="h5 fw-bold">Final Project: Recipe Explorer</h3>
                    <p class="text-muted small mb-3">Full Stack Vue.js Application</p>
                    <p class="mb-3">A comprehensive recipe management platform with user authentication, personalized dashboards, family recipes collection, and recipe search functionality. Built with Vue.js frontend and RESTful API backend.</p>
                    <router-link to="/" class="btn btn-outline-primary btn-sm">Explore App</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-5">
      <div class="col-lg-10 mx-auto">
        <div class="card border-0 shadow-sm">
          <div class="card-body p-4 text-center">
            <h2 class="h3 fw-bold mb-4">Ben Gurion University</h2>
            <img src="https://upload.wikimedia.org/wikipedia/en/2/29/Ben-Gurion_University_of_the_Negev.svg" alt="BGU Logo" class="bgu-logo mb-4" style="max-width: 300px;">
            <p class="mb-3">
              Department of Software and Information Systems Engineering<br>
              Web Environments Development Course - 2025
            </p>
            <a href="https://in.bgu.ac.il/en/engn/sise/ennew/Pages/default.aspx" target="_blank" class="btn btn-primary">Visit BGU Website</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage"
};
</script>

<style scoped>
.about-page {
  padding: 2rem 0;
}

.avatar-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle.large {
  width: 120px;
  height: 120px;
}

.initials {
  font-size: 2rem;
  font-weight: bold;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background-color: #007bff;
  color: white;
}

.previous-project {
  transition: transform 0.3s ease;
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.previous-project:hover {
  transform: translateY(-5px);
}

.bgu-logo {
  filter: grayscale(0%);
  transition: filter 0.3s ease;
}

.bgu-logo:hover {
  filter: grayscale(0%);
}
</style>
