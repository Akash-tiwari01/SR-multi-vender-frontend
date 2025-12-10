import React, { useState } from 'react';
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

export const RHFButton = ({text,type,disabled,className, })=>{

}