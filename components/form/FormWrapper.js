import { useVerification } from '@/app/hooks/useVerification';
import { CheckCircle2, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
// The useFormContext import is kept here for reference if you expand to use Context later, 
// but is not strictly necessary for these components as props are passed directly.

// Helper function to safely access nested error messages
const getNestedError = (errors, name) => {
  const parts = name.split('.');
  let error = errors;
  for (const part of parts) {
    if (error && error[part]) {
      error = error[part];
    } else {
      return null;
    }
  }
  return error?.message;
};

// --- 1. Generic RHF Input Wrapper ---

/**
 * Reusable wrapper for standard text, email, password, or number inputs using RHF's register.
 * @param {object} props - Component props.
 * @param {string} props.name - The field name.
 * @param {string} props.label - The visible label text.
 * @param {object} props.register - The register function from useForm.
 * @param {object} props.errors - The errors object from formState.
 * @param {string} [props.type='text'] - Input type (text, email, password, etc.).
 * @returns {JSX.Element}
 * * SOLID Principle: Open/Closed Principle (OCP) and Single Responsibility Principle (SRP).
 */
export const RHFInputWrapper = ({ name, label, register, errors, type = 'text', ...rest }) => {
  
  const errorMessage = errors[name]?.message || getNestedError(errors, name);
  const hasError = !!errorMessage;

  const inputClass = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 transition duration-150";
  
  const finalInputClass = `${inputClass} ${
    hasError 
      ? 'border-red-500 focus:border-red-500' 
      : 'border-slate-300 focus:border-rose-500'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor={name}>
        {label}
      </label>
      <input 
        type={type} 
        id={name} 
        {...register(name)} 
        className={finalInputClass}
        {...rest}
      />
      {errorMessage && <p className="mt-1 text-xs text-red-500 font-medium">{errorMessage}</p>}
    </div>
  );
};

// --- 2. Generic RHF Checkbox Wrapper ---

/**
 * Reusable wrapper for a single checkbox input using RHF's register.
 * * SOLID Principle: Single Responsibility Principle (SRP).
 * @param {object} props - Component props.
 * @param {string} props.name - The field name (must match Zod schema).
 * @param {string} props.label - The visible label text associated with the checkbox.
 * @param {object} props.register - The register function from useForm.
 * @param {object} props.errors - The errors object from formState.
 * @returns {JSX.Element}
 */
export const RHFCheckboxWrapper = ({ name, label, register, errors, ...rest }) => {
  const hasError = errors[name];
  const errorMessage = hasError?.message;

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={name}
          // The register function handles setting the value (true/false)
          {...register(name)}
          className={`h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 ${
            hasError ? 'border-red-500' : ''
          }`}
          {...rest}
        />
        <label className="text-sm font-medium text-slate-700 select-none" htmlFor={name}>
          {label}
        </label>
      </div>
      {/* Display error message below the checkbox */}
      {errorMessage && <p className="mt-1 text-xs text-red-500 font-medium ml-6">{errorMessage}</p>}
    </div>
  );
};

// --- 3. Generic RHF Select/Dropdown Wrapper (NEW) ---

/**
 * Reusable wrapper for a Select dropdown input using RHF's register.
 * @param {object} props - Component props.
 * @param {string} props.name - The field name (must match Zod schema).
 * @param {string} props.label - The visible label text.
 * @param {object} props.register - The register function from useForm.
 * @param {object} props.errors - The errors object from formState.
 * @param {Array<{value: string, label: string}>} props.options - Array of options for the select.
 * @returns {JSX.Element}
 * * SOLID Principle: Single Responsibility Principle (SRP).
 * Explanation: This component is solely responsible for rendering a dropdown and managing its RHF integration and error display.
 */
export const RHFOptionSelect = ({ name, label, register, errors, options, ...rest }) => {
  const errorMessage = errors[name]?.message || getNestedError(errors, name);
  const hasError = !!errorMessage;

  const selectClass = "w-full p-3 border rounded-lg focus:ring-2 focus:ring-rose-500 transition duration-150 appearance-none bg-white pr-8";
  
  const finalSelectClass = `${selectClass} ${
    hasError 
      ? 'border-red-500 focus:border-red-500' 
      : 'border-slate-300 focus:border-rose-500'
  }`;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-600 mb-1" htmlFor={name}>
        {label}
      </label>
      <select 
        id={name} 
        {...register(name)} 
        className={finalSelectClass}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.value === ''}>
            {option.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow for better styling */}
      <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-slate-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>

      {errorMessage && <p className="mt-1 text-xs text-red-500 font-medium">{errorMessage}</p>}
    </div>
  );
};


// --- 4. RHF File Upload Field (Unchanged) ---

/**
 * Custom file upload component integrated with RHF via setValue and watch.
 * @param {object} props - Component props.
 * @param {string} props.name - The field name.
 * @param {string} props.label - The visible label text.
 * @param {function} props.setValue - The setValue function from useForm.
 * @param {function} props.watch - The watch function from useForm.
 * @param {object} props.errors - The errors object from formState.
 * @returns {JSX.Element}
 */
export const RHFFileField = ({ name, label, setValue, watch, errors }) => {
  const [loading, setLoading] = useState(false);
  // Watch the field to show the current URL/value stored in the form state
  const fileValue = watch(name); 
  const hasError = errors[name];
  const errorMessage = hasError?.message;

  const uploadImage = async (imageFile) => {
    if (!imageFile) return;

    // --- Simulation of API Call to upload file ---
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    // Mock the URL returned from the server
    const mockImageUrl = `/uploads/${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
    // --- End Simulation ---

    // Update the RHF form state with the resulting URL
    // { shouldValidate: true } triggers Zod validation immediately after setting the value
    setValue(name, mockImageUrl, { shouldValidate: true }); 
    setLoading(false);
  };
  
  const handleRemove = () => {
    // Clear the form value and re-validate
    setValue(name, null, { shouldValidate: true }); 
  };
  
  const buttonClass = "px-3 py-1 text-sm rounded-lg shadow-sm transition duration-150";
  
  return (
    <div className="space-y-3 p-4 border border-slate-200 rounded-lg">
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      
      {loading ? (
        // Loading State UI
        <div className="h-10 w-full bg-slate-200 rounded-lg animate-pulse" />
      ) : fileValue ? (
        // Display existing image and removal button
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-300">
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 text-center">
              Image Loaded: <br/> {fileValue.substring(fileValue.lastIndexOf('/') + 1)}
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className={`${buttonClass} bg-rose-600 text-white hover:bg-rose-700`}
          >
            Remove
          </button>
        </div>
      ) : (
        // File upload input
        <div>
          <input
            type="file"
            id={name}
            onChange={(e) => uploadImage(e.target.files[0])}
            className="block w-full text-sm text-slate-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-rose-50 file:text-rose-700
                       hover:file:bg-rose-100"
          />
        </div>
      )}
      
      {errorMessage && <p className="mt-1 text-xs text-red-500 font-medium">{errorMessage}</p>}
      
    </div>
  );
};


// --- 5. RHF Button ---

export const RHFButton = ({children,type,disabled,className,onClick })=>(
  <button
    type={type?type:"button"}
    disabled={disabled} 
    className={`w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${className}`}
    onClick={onClick || null}
  >
    {children}
  </button>
)


// RHFOtpInput.jsx

export function RHFOtpInput({
    length = 6,
    value,
    onChange,
    onComplete,
}) {
    const inputsRef = useRef([]);

    // Auto-verify when full OTP is entered
    useEffect(() => {
        if (value.length === length) {
            onComplete?.(value);
        }
    }, [value, length, onComplete]);

    const handleChange = (e, index) => {
        // Allow only a single digit and strip non-digits
        const digit = e.target.value.replace(/\D/g, "").slice(0, 1); 

        if (!digit) return;

        // Construct the new OTP string
        const newValue =
            value.slice(0, index) +
            digit +
            value.slice(index + 1);

        onChange(newValue);

        // Move focus to the next input
        if (index < length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            e.preventDefault();

            if (value[index]) {
                // If there is a value in the current box, clear it
                const newValue =
                    value.slice(0, index) +
                    " " +
                    value.slice(index + 1);
                
                // Use trimEnd to ensure trailing spaces are removed if the last digit is deleted
                onChange(newValue.trimEnd()); 
            } else if (index > 0) {
                // If the current box is empty, move to the previous and optionally clear it (optional, but often preferred)
                inputsRef.current[index - 1].focus();
                
                // Optionally clear the previous box when backspacing from an empty one
                const prevIndex = index - 1;
                const newValue = 
                    value.slice(0, prevIndex) + 
                    " " + 
                    value.slice(prevIndex + 1);
                onChange(newValue.trimEnd());
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        onChange(pasted);

        // Move focus to the last pasted element
        if (pasted.length > 0) {
             const focusIndex = Math.min(pasted.length, length) - 1;
             inputsRef.current[focusIndex]?.focus();
        }
    };


    return (
        <div>
            <div className="flex gap-2">
                {Array.from({ length }).map((_, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        value={value[index] || ""}
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        inputMode="numeric"
                        maxLength={1}
                        className="w-10 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                ))}
            </div>
        </div>
    );
}



// Import your components and hook
// import { RHFOtpInput } from './RHFOtpInput'; 
// import { useVerification } from './useVerification'; 



export function RHFOtpInputWrapper({
    length = 6,
    fieldWatcher,
    verificationWatcher,
    fieldName,
    otpSendAction,
    otpVerifyaction,
    errorMessage, // RHF Error
    setValue,
    name
}) {
    const { 
        canVerify, otpSent, loading, otp, setOtp, 
        sendOtp, verifyOtp, error, timeLeft, canResend 
    } = useVerification({
        value: fieldWatcher,
        onReset: () => setValue(fieldName, false),
        otpLength: length
    });

    const wrappedVerify = verifyOtp(
        otpVerifyaction,
        () => setValue(fieldName, true, { shouldDirty: true })
    );

    // Production-ready error logic: React Crash se bachne ke liye string check
    const getDisplayError = () => {
        // priority 1: Custom Verification Error (Invalid OTP)
        if (error) return error;
        // priority 2: RHF Validation Error
        
        return null;
    };

    const displayError = getDisplayError();

    return (
        <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-3'>
                
                {/* 1. OTP Inputs */}
                {canVerify && otpSent && !verificationWatcher && (
                    <RHFOtpInput 
                        value={otp}
                        onChange={setOtp}
                        onComplete={wrappedVerify}
                        length={length}
                    />
                )}
                
                {/* 2. Action Button */}
                {canVerify && !verificationWatcher && (
                    <div className='flex items-center gap-2'>
                        <button
                            type="button"
                            disabled={loading || (otpSent && otp.length !== length)}
                            onClick={!otpSent ? () => sendOtp(otpSendAction) : wrappedVerify}
                            className={`border-2 px-3 h-9 rounded-md text-sm transition-all font-bold flex items-center
                                ${loading ? 'bg-gray-100 text-gray-400 border-gray-200' : 
                                  otpSent ? 'text-amber-900 bg-amber-200 border-amber-300 hover:bg-amber-400' : 
                                  'text-rose-700 bg-rose-200 border-rose-300 hover:bg-rose-400'}`}
                        > 
                            {loading && <Loader2 className='animate-spin mr-2' size={16} />}
                            {!loading && (otpSent ? `Verify` : `Send OTP`)}
                            {loading && (otpSent ? 'Verifying...' : 'Sending...')}
                        </button>

                        {/* 3. Resend/Timer Section */}
                        {otpSent && (
                            <div className="flex items-center">
                                {!canResend ? (
                                    <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-2 py-1.5 rounded border border-gray-200 text-[11px] font-medium">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                        </span>
                                        {timeLeft}s
                                    </div>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => sendOtp(otpSendAction)} 
                                        className="text-blue-600 text-xs font-bold hover:underline ml-1"
                                    >
                                        Resend?
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 4. Success State */}
                {verificationWatcher && (
                    <div className="text-green-600 text-sm font-bold flex items-center bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
                        <CheckCircle2 className='mr-2' size={18}/> {name} Verified
                    </div>
                )}
            </div>
            
            {/* 5. Error Display */}
            {displayError && (
                <p className="text-[12px] text-red-600 font-bold mt-1 flex items-center gap-1">
                    <span>⚠️</span> {displayError}
                </p>
            )}
        </div>
    );
}