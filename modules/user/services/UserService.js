// src/modules/user/services/UserService.js
import { UserAPIRepository } from "../repositories/UserAPIRepository";
import { CustomerRegistrationSchema } from "../model";

/**
 * @description Provides the business logic for all Customer operations.
 */
export class UserService {
  
  /** @private */
  userRepository;

  constructor() {
    this.userRepository = new UserAPIRepository();
  }

  /**
   * Validates and executes customer registration.
   * @param {object} rawData - Data received from the Server Action.
   * @returns {Promise<{ user: object, token: string }>}
   */
  async registerCustomer(rawData) {
    
    // 1. **Server-Side Validation**: Ensures data integrity before hitting the repo
    // Note: We use the base schema without the temporary 'termsAccepted' field for the API payload validation.
    const validatedData = CustomerRegistrationSchema.omit({ termsAccepted: true }).parse(rawData);

    // 2. Delegation and Execution
    try {
      const result = await this.userRepository.registerCustomer(validatedData);
      console.log(`Customer registration successful for user: ${result?.user?.email || result?.email}`);

      return result;
      
    } catch (error) {
      // Logic transformation: Convert technical error into user-facing message
      if (error.message.includes('email already exists')) {
         throw new Error('This email address is already registered. Please login.');
      }
      throw error; // Re-throw any critical/unexpected error
    }
  }
}