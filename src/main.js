import { createApp } from 'vue';
import App from './App.vue';
import routes from './router/index';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createRouter, createWebHistory } from 'vue-router';
// import * as bootstrap from 'bootstrap';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

import store from './store';

// Set up Axios with default configs
axios.defaults.withCredentials = true;

// Add request interceptor for debugging
axios.interceptors.request.use(
  config => {
    console.log('Starting Request', config);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  }
);

// Make axios available globally
window.axios = axios;

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Make router available globally
window.router = router;

// Create a simple toast notification function
// Function removed to avoid duplication with app.config.globalProperties.toast

const app = createApp(App);

app.use(router);
app.use(VueAxios, axios);

app.config.globalProperties.store = store;

// Make store available globally
window.store = store;

app.config.globalProperties.toast = function (title, content, variant = null, append = false) {
  const toastContainerId = "toast-container";
  let toastContainer = document.getElementById(toastContainerId);
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = toastContainerId;
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "1rem";
    toastContainer.style.right = "1rem";
    toastContainer.style.zIndex = "1055";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-bg-${variant || 'info'} border-0 show`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <strong>${title}</strong><br>${content}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  if (!append) {
    toastContainer.innerHTML = "";
  }
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
};

app.mount('#app');
