"use client";

import React, { useState } from 'react';
// RHF and Zod imports
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import { vendorSchema } from '@/modules/vendor/model/vendorModel';
// Action and Wrapper imports
import { registerVendorAction } from '@/lib/action'; 
import { RHFInputWrapper, RHFCheckboxWrapper, RHFOptionSelect, RHFButton, RHFOtpInput, RHFOtpInputWrapper } from '@/components/form/FormWrapper';
//Router to redirect
import { useVerification } from '@/app/hooks/useVerification';
import { sendEmailOtp, verifyEmailOtp, sendPhoneOtp, verifyPhoneOtp } from '@/lib/action';
import { useRouter } from 'next/navigation';

// --- VENDOR TYPE OPTIONS ---
const VENDOR_TYPE_OPTIONS = [
  { value: '', label: 'Select Vendor Type' },
  { value: 'Individual', label: 'Individual (Sole Proprietor)' },
  { value: 'Company', label: 'Company (Registered Business)' },
];




export default function VendorRegistrationForm() {
  

  const router = useRouter();
  // RHF Integration
  const { 
    register,
    control,
    setValue, 
    handleSubmit, 
    formState: { errors, isSubmitting }, 
    reset, 
  } = useForm({
    resolver: zodResolver(vendorSchema), 
    defaultValues: {
      name: '', phone: '', email: '', password: '',
      vendor: { vendor_type: '' }, 
      termsAccepted: false,phoneVerified: false,
      emailVerified:false
    }
  });

  // State for Server Action result messages
  const [serverMessage, setServerMessage] = useState(null); 
  
  // Submission Handler
  const onSubmit = async (data) => {
    setServerMessage(null);
    
    try {
      const submissionData = {
        ...data,
        role: "VENDOR", 
      };

      // Call the Server Action which makes the API call
      const result = await registerVendorAction(submissionData); 
      
      // --- SUCCESS HANDLING: Token and External Redirect ---
      if (result && result.token && result?.name !== "ApiError") {
        // 1. Store token in local storage (for redundancy/backup if external site fails to parse URL)
        localStorage.setItem('token', result.token); 
        
        // 2. Construct the external URL with the token as a query parameter
        // This supports the external site's immediate need for the token.
        
        // 3. Redirect to the external website
        
        setServerMessage({ 
          type: 'success', 
          text: "Registration successful! Redirecting to vendor portal..." 
        });

        router.push(`vendor/phasetwo`);
        
      }else if(result?.name == "ApiError")
      {
        console.log(result);
        setServerMessage({ 
          type: 'warning', 
          text: result?.data?.message
        });
        reset();
      }
       else {
        setServerMessage({ 
          type: 'success', 
          text: 'Registration successful, Please try logging in.' 
        });
      }

    } catch (error) {
      // Handles errors thrown by the Server Action
      console.error(error);
      setServerMessage({ 
        type: 'error', 
        text: `Network Error Please try after some time` 
      });
    } 
  };

  const email = useWatch({ control, name: "email" });
  const phone = useWatch({ control, name: "phone" });
  const emailVerified = useWatch({ control, name: "emailVerified" });
  const phoneVerified = useWatch({ control, name: "phoneVerified" });


  return (
    <div className="bg-white rounded-md p-6 sm:p-10 border border-slate-200">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4 text-center">
        Vendor Registration
      </h2>

      {/* Message Box */}
      {serverMessage && (
        <div 
          className={`p-4 mb-6 rounded-lg font-medium ${
            serverMessage.type === 'success' ? 'bg-rose-100 text-rose-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {serverMessage.text}
        </div>
      )}

      {/* Use RHF's handleSubmit wrapper */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* === Personal Details === */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-700 border-l-4 border-rose-500 pl-3">Your Account</h3>
          
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

          <RHFOtpInputWrapper 
            fieldWatcher={email}
            verificationWatcher={emailVerified}
            fieldName="emailVerified"
            otpSendAction={sendEmailOtp}
            otpVerifyaction={verifyEmailOtp}
            setValue={setValue}
            errorMessage={errors.emailVerified}
            name="Email"
            />

            <RHFInputWrapper
              name="phone"
              label="Phone Number"
              type="tel"
              register={register}
              errors={errors}
            />

            <RHFOtpInputWrapper
              name="Phone"
              fieldWatcher={phone}
              verificationWatcher={phoneVerified}
              fieldName="phoneVerified"
              otpSendAction={sendPhoneOtp}
              otpVerifyaction={verifyPhoneOtp}
              errorMessage={errors.phoneVerified}
              setValue={setValue}
              />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
           <RHFInputWrapper
              name="password"
              label="Password"
              type="password"
              register={register}
              errors={errors}
            />
            <RHFInputWrapper
              name="comfirmed password"
              label="Confirmed Password"
              type="password"
              register={register}
              errors={errors}
            />
            

          </div>
        </div>

        {/* === Vendor Details (Nested) === */}
        <div className="pt-4 space-y-4 border-t border-slate-200">
          <h3 className="text-xl font-semibold text-slate-700 border-l-4 border-rose-500 pl-3">Vendor Information</h3>
          
          <RHFOptionSelect
            name="vendor.vendor_type"
            label="Select Primary Vendor Type"
            register={register}
            errors={errors}
            options={VENDOR_TYPE_OPTIONS}
          />
          
        </div>
        
        {/* === Terms & Conditions Checkbox === */}
        <div className="pt-4 space-y-4 border-t border-slate-200">
          <RHFCheckboxWrapper
            name="termsAccepted"
            label="I agree to the Vendor Terms and Conditions and Privacy Policy."
            register={register}
            errors={errors}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting} 
          className="w-full py-3 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-rose-700 transition duration-300 ease-in-out disabled:bg-rose-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Registering...</span>
            </>
          ) : (
            <span>Register as Vendor</span>
          )}
        </button>
      </form>

      <p className="text-sm text-center text-slate-500 mt-6">
        By registering, you agree to the Vendor Terms and Conditions.
      </p>
    </div>
  );
}