// src/modules/user/repositories/UserAPIRepository.js
import { apiClient } from "@/utils/api";

/**
 * @description Handles direct communication with the external User/Auth backend API.
 * The concrete API route is handled here: POST /api/users/register.
 */
export class UserAPIRepository {
  
  /**
   * Registers a new customer on the backend.
   * @param {object} payload - The validated registration data.
   * @returns {Promise<{ user: object, token: string }>} The result from the API.
   */
  

  async registerCustomer(payload) {
    
    // We only send the fields the backend needs, excluding role if the backend infers it.
    const apiPayload = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      role: payload.role, // "CUSTOMER"
    };
    
    // API route specified by the user: POST /api/users/register
    const result = await apiClient.post('/api/users/register', apiPayload);

    return result; 
  }

  async login(credentials){

    const result = await apiClient.post('/api/users/login',credentials);
    return result;
  }

  async requestOtp(phone){
    const result = await apiClient.post('/api/users/websites/gerate-otp',{phone});
    return result;
  }

  async verifyOtp(otp_id, otp){
    const apiPayload = {
      otp_id,
      otp
    }
    const result = await apiClient.post('/api/users/websites/verify-otp',apiPayload)
    return result;
  }

  async updateProfile(payload, token) {
    // Uses the generalized put method from apiClient
    const result = await apiClient.put('/api/users/profile', payload, token);
    return result;
  }

  async verifyToken(token) {
    // Ping profile endpoint to check if valid
    const user = await apiClient.get('/api/users/profile', {}, token);
    return { user, token };
  }

}