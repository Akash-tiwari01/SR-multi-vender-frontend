"use client"
import React, { useState } from 'react';

/**
 * Renders the user registration form.
 * The design is responsive, using Tailwind CSS with a slate background and rose accents.
 *
 * It manages local state for form inputs and includes an asynchronous handler for submission.
 *
 * SOLID Principles Check:
 * - Single Responsibility Principle (SRP): This component is solely responsible for rendering the registration UI,
 * managing local form state, and initiating the registration request (which would be handled by a service layer
 * in a more complex application, but is included here for completeness).
 * - Maintainability: Clear separation of UI (JSX) and logic (handleSubmit).
 */
const RegisterPage = () => {
    // State to hold form data, matching the structure expected by the backend.
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Updates the state whenever an input field changes.
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear previous error message on user input
        if (error) setError(null);
        if (success) setSuccess(false);
    };

    // Handles the form submission logic.
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Simple client-side validation
        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            // --- Placeholder for API Call ---
            // NOTE: Replace '/api/users/register' with the actual path to your backend endpoint.
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                setSuccess('Registration successful! Redirecting to login...');
                setFormData({ name: '', phone: '', email: '', password: '' });
                // In a real app, you would redirect the user here.
                // router.push('/login');
            } else {
                // Registration failed (e.g., user exists, invalid data)
                // Use the error message returned from the backend (data.message)
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Network or system error:', err);
            setError('A network error occurred. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Custom Input Field Component for DRY and cleaner JSX
    const FormInput = ({ label, name, type, value, onChange, placeholder }) => (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500
                           transition duration-150 ease-in-out text-slate-800"
            />
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-slate-200">
                <h1 className="text-3xl font-extrabold text-slate-800 mb-6 text-center">
                    Create Account
                </h1>
                <p className="text-center text-slate-500 mb-8">
                    Start your journey with us today.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                    />
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                    />
                    <FormInput
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="555-123-4567"
                    />
                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    {/* Feedback Messages */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 text-sm text-rose-700 bg-rose-100 rounded-lg border border-rose-300">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition duration-300 ease-in-out
                            ${loading
                                ? 'bg-rose-400 cursor-not-allowed'
                                : 'bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300 active:bg-rose-800'
                            }
                            sm:text-lg mt-6
                        `}
                    >
                        {loading ? 'Processing...' : 'Register'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/login" className="text-sm text-rose-600 hover:text-rose-700 font-medium transition duration-150 ease-in-out">
                        Already have an account? Sign In
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;