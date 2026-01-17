import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

export const authService = {
  async login(email, password) {
    const response = await api.post('/login', { email, password });
    if (response.data.success) {
      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify({
        employeeId: response.data.employeeId,
        email: response.data.email,
        role: response.data.role,
        employeeCode: response.data.employeeCode,
        fullName: response.data.fullName,
        designation: response.data.designation,
      }));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getUserData() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUserData();
  },
};
