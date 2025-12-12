"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; 
// Import schema for client-side validation
import { CustomerRegistrationSchema } from '@/modules/user/model'; 
// Import Server Action for submission
import { registerCustomerAction } from '@/lib/action'; 
// Assuming placeholder wrappers exist
import { RHFInputWrapper, RHFCheckboxWrapper, RHFButton } from '@/components/form/FormWrapper'; 
import Link from 'next/link';

// NOTE: The CustomerRegistrationSchema already includes 'role: z.literal("CUSTOMER")'
const defaultValues = {
  name: '', phone: '', email: '', password: '', 
  role: 'CUSTOMER', 
  termsAccepted: false, 
};

export default function CustomerRegistrationForm() {
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset, 
  } = useForm({
    resolver: zodResolver(CustomerRegistrationSchema), 
    defaultValues,
  });

  const [serverMessage, setServerMessage] = useState(null); 
  
  const onSubmit = async (data) => {
    setServerMessage(null);
    
    try {
      // Pass the full data object, including 'termsAccepted' and 'role', to the Server Action.
      // The action/service layer handles stripping fields the API doesn't need.
      const result = await registerCustomerAction(data); 
      
      if (result && result.token) {
        
        setServerMessage({ 
          type: 'success', 
          text: `Registration successful for ${result?.user?.name || result?.name}. Please proceed to login.` 
        });
        reset();
        
        // In a real app, you would redirect here using router.push('/login')
        
      } else {
        setServerMessage({ 
          type: 'error', 
          text: 'Registration successful, but session token was missing. Please try logging in.' 
        });
      }

    } catch (error) {
      setServerMessage({ 
        type: 'error', 
        text: error.message || 'A critical error occurred during registration.' 
      });
    } 
  };

  // Helper for conditional styling
  const messageClass = serverMessage 
    ? (serverMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')
    : '';

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 border border-slate-200 max-w-lg mx-auto my-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4 text-center">
        Customer Registration
      </h2>

      {/* Message Box */}
      {serverMessage && (
        <div className={`p-4 mb-6 rounded-lg font-medium ${messageClass}`}>
          {serverMessage.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* === Account Details === */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700 border-l-4 border-blue-500 pl-3">Your Details</h3>
          
          <RHFInputWrapper
            name="name"
            label="Full Name"
            type="text"
            register={register}
            errors={errors}
          />

          <RHFInputWrapper
            name="email"
            label="Email Address"
            type="email"
            register={register}
            errors={errors}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RHFInputWrapper
              name="phone"
              label="Phone Number"
              type="tel"
              register={register}
              errors={errors}
            />
            
            <RHFInputWrapper
              name="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />
          </div>
        </div>
        
        {/* === Terms & Conditions Checkbox === */}
        <div className="pt-4 space-y-4 border-t border-slate-200">
          <RHFCheckboxWrapper
            name="termsAccepted"
            label="I agree to the Customer Terms and Conditions and Privacy Policy."
            register={register}
            errors={errors}
          />
        </div>

        {/* Submit Button */}
        <RHFButton
          text="Register"
          type="submit"
          disabled={isSubmitting}
          className="">
             {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Registering...</span>
            </>
          ) : (
            <span>Register Now</span>
          )}
          </RHFButton>
      </form>

      <p className="text-sm text-center text-slate-500 mt-6">
        Already have an account? 
        <Link href="/user/login" className="text-blue-600 hover:underline font-medium ml-1">Log In here</Link>.
      </p>
    </div>
  );
}

// --- Placeholder for Form Wrapper Components (Must be defined in your project) ---
/* * You need to define RHFInputWrapper and RHFCheckboxWrapper 
 * in /src/components/form/FormWrapper.jsx for this code to run. 
 * They handle displaying the label, input, and RHF errors using Tailwind CSS.
*/