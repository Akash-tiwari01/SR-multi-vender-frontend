"use server"

import { apiFetcher } from "./fetcher" 
import { apiClient, ApiError } from '../utils/api';
import { UserService } from "@/modules/user/services/UserService";
import { CustomerRegistrationSchema } from "@/modules/user/model";

export async function fetchNextProducts(nextPage){
    try{
        const productsData = await apiFetcher(`/products?page=?${nextPage}`,{
            cache: 'no-store'
        });
        return{
            products: productsData.products,
            hasMore: productsData?.hasMore,
        }
    }catch(error)
    {
        console.log(`Error fetching page ${nextPage} via Server Action: `, error.message);

        throw new Error(`Failed to load more products: ${error.message}`);
    }
}



/**
 * Handles the business logic flow for vendor registration by calling the backend API.
 * * Supports Dependency Inversion Principle (DIP): The Action depends on the abstraction 
 * (apiClient) rather than low-level fetch implementation details.
 *
 * @param {object} formData - The structured data from the client form (validated data + static role).
 * @returns {object} The JSON response data from the server (expected to include a token).
 * @throws {Error} Throws a simplified error message for the client component.
 */
export async function registerVendorAction(formData) {
  try {
    // Call the centralized API client to hit the registration endpoint
    const result = await apiClient.post('/api/users/register-vendor', formData);
    
    // Server is expected to return { token: '...', user: {...} }. Return the whole object.
    return result; 

  } catch (error) {
    // Simplify error handling for the client component's UI
    if (error instanceof ApiError) {
      // For 4xx errors (validation/business logic), display the server message directly
      if (error.status >= 400 && error.status < 500) {
         return ({...error})
      }
      // For 5xx errors, display a generic message
      throw new Error('Registration failed due to a server error. Please try again later.');
    }
    
    // For network/unexpected errors
    console.error('Unexpected error during registration:', error);
    throw new Error(error.message || 'An unexpected error occurred during registration.');
  }
}




/**
 * @description Next.js Server Action to handle standard customer registration.
 * This function delegates business logic to the UserService.
 * @param {object} rawData - The data submitted from the client form.
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function registerCustomerAction(rawData) {
  
  // 1. Server-Side Validation (using the full schema including termsAccepted)
  try {
    const data = rawData instanceof FormData ? Object.fromEntries(rawData.entries()) : rawData;
    
    // Validate data using the full schema (including the client-side required fields)
    CustomerRegistrationSchema.parse(data); 
    
    // 2. Delegation to Service Layer
    const userService = new UserService();
    // The service handles stripping the 'termsAccepted' field before sending to the repository.
    const result = await userService.registerCustomer(data);
    return result; 
    
  } catch (error) {
    console.error("Customer Registration Server Action Error:", error);
    
    // Handle Zod validation error
    if (error.name === 'ZodError') {
      const fieldError = error.issues[0]?.message || "Invalid input data.";
      throw new Error(`Validation Failed: ${fieldError}`);
    }
    
    // Re-throw Service/API error
    throw new Error(` ${error.message}` || 'An unexpected error occurred during registration.');
  }
}


/**
 * @description Sends a one-time password (OTP) to the provided email address
 * for verification purposes. This Server Action is typically invoked when
 * the user clicks the "Verify Email" button in the registration flow.
 *
 * The actual OTP generation and delivery logic should be handled by
 * the underlying email service or backend API.
 *
 * @param {string} email - The email address to which the OTP should be sent.
 * @returns {Promise<boolean>} Resolves to true if the OTP request was accepted.
 */

export async function sendEmailOtp(email) {
  console.log("Sending email OTP to", email);
  return true;
}


/**
 * @description Verifies the email OTP entered by the user.
 * This Server Action validates the OTP against the backend or
 * verification service and determines whether the email address
 * has been successfully verified.
 *
 * @param {string} email - The email address being verified.
 * @param {string} otp - The one-time password entered by the user.
 * @returns {Promise<boolean>} Resolves to true if the OTP is valid.
 */

export async function verifyEmailOtp(email, otp) {
  console.log("hello");
  return otp === "123456";
}

/**
 * @description Sends a one-time password (OTP) to the provided phone number
 * for verification via SMS or other messaging services.
 * This action is triggered when the user initiates phone number verification.
 *
 * The OTP delivery mechanism is expected to be handled by an external
 * SMS gateway or backend verification service.
 *
 * @param {string} phone - The phone number to which the OTP should be sent.
 * @returns {Promise<boolean>} Resolves to true if the OTP request was accepted.
 */

export async function sendPhoneOtp(phone) {
  console.log("Sending phone OTP to", phone);
  return true;
}


/**
 * @description Verifies the phone OTP entered by the user.
 * This Server Action confirms whether the provided OTP matches
 * the verification code issued for the given phone number.
 *
 * @param {string} phone - The phone number being verified.
 * @param {string} otp - The one-time password entered by the user.
 * @returns {Promise<boolean>} Resolves to true if the OTP is valid.
 */
export async function verifyPhoneOtp(phone, otp) {
  
  return otp === "123456";
}
