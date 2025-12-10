// src/modules/user/repositories/UserAPIRepository.js
import { apiClient } from "@/utils/api";
import { apiFetcher } from "@/lib/fetcher";
import { nextApiFetch } from "@/utils/nextApiFetch";

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

  setSessionCookie = async (token) =>{
    // This is a standard fetch call that the Saga runtime handles perfectly.
      const response = await nextApiFetch('/api/auth/session', {
          method: 'POST',
          body: JSON.stringify({ token }),
      });
      return response;
  }

  clearSessionCookie = async () =>{
      const response = await nextApiFetch('/api/auth/session', {
          method: 'DELETE',
      });
      return response;
  }
}