import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('nourishly_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('nourishly_token');
      localStorage.removeItem('nourishly_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  me: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  uploadAvatar: (formData) => api.post('/auth/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// Recipes
export const recipesAPI = {
  getAll: (params) => api.get('/recipes', { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  getByUser: (userId) => api.get(`/recipes/user/${userId}`),
  create: (formData) => api.post('/recipes', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/recipes/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/recipes/${id}`),
};

// Saves
export const savesAPI = {
  getMySaved: () => api.get('/saves'),
  save: (recipeId) => api.post(`/saves/${recipeId}`),
  unsave: (recipeId) => api.delete(`/saves/${recipeId}`),
  status: (recipeId) => api.get(`/saves/${recipeId}/status`),
};

// Likes
export const likesAPI = {
  like: (recipeId) => api.post(`/likes/${recipeId}`),
  unlike: (recipeId) => api.delete(`/likes/${recipeId}`),
  status: (recipeId) => api.get(`/likes/${recipeId}/status`),
};

// Comments
export const commentsAPI = {
  getByRecipe: (recipeId) => api.get(`/comments/recipe/${recipeId}`),
  post: (recipeId, content) => api.post(`/comments/recipe/${recipeId}`, { content }),
  delete: (commentId) => api.delete(`/comments/${commentId}`),
};

// Users
export const usersAPI = {
  getProfile: (userId) => api.get(`/users/${userId}`),
};

// AI
export const aiAPI = {
  generateDescription: (data) => api.post('/ai/generate-description', data),
  ingredientSub: (data) => api.post('/ai/ingredient-sub', data),
  fridgeRecipes: (ingredients) => api.post('/ai/fridge-recipes', { ingredients }),
};

export default api;
