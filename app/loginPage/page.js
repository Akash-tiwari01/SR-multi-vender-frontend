"use client";
import Link from "next/link";
import React, { useState } from "react";

// Assuming lucide-react or similar is available for icons
const User = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const Lock = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const Mail = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const Eye = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const Loader = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- Custom Form Field Component ---
const FormInput = ({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white text-gray-800 shadow-sm disabled:bg-gray-100 disabled:text-gray-500"
      />
      {isPasswordField && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-indigo-600 transition duration-150"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <Eye className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

// --- Login Form Component ---
const LoginForm = ({ setView, setLoggedInUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Signing in...");

    // Simulate API call delay (2 seconds)
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        // Simulate successful login
        setLoggedInUser({ name: "Demo User", email: email });
        setView("home");
      } else {
        setMessage("Please enter both email and password.");
      }
    }, 2000);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        Welcome Back!
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Sign in to access your account.
      </p>

      {message && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            isLoading
              ? "text-indigo-700 bg-indigo-100"
              : "text-red-700 bg-red-100"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          icon={Mail}
          type="email"
          placeholder="Email Address (e.g., user@example.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder="Password (e.g., password123)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.01] disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader />
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => setView("register")}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
            disabled={isLoading}
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Register Form Component ---
const RegisterForm = ({ setView, setLoggedInUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("Registering account...");

    // Simulate API call delay (2 seconds)
    setTimeout(() => {
      setIsLoading(false);
      if (name && email && password) {
        // Simulate successful registration
        setLoggedInUser({ name: name, email: email });
        setView("home"); // Switch to home view
      } else {
        setMessage("Please fill out all required fields.");
      }
    }, 2000);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
        Join Us Today
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Create your new account in seconds.
      </p>

      {message && (
        <div
          className={`p-3 mb-4 text-sm rounded-lg ${
            isLoading
              ? "text-indigo-700 bg-indigo-100"
              : "text-blue-700 bg-blue-100"
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <FormInput
          icon={User}
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        <FormInput
          icon={Mail}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <FormInput
          icon={Lock}
          type="password"
          placeholder="Set Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex items-center mb-6">
          <input
            id="terms-conditions"
            name="terms-conditions"
            type="checkbox"
            required
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            disabled={isLoading}
          />
          <label
            htmlFor="terms-conditions"
            className="ml-2 block text-sm text-gray-600"
          >
            I agree to the{" "}
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Terms and Conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.01] disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader />
              Registering...
            </>
          ) : (
            "Register Account"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => setView("login")}
            className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-150"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

// --- Home Page Component (New) ---
const HomePage = ({ setView, user }) => {
  const handleLogout = () => {
    // Clear user session (simulated) and switch back to login view
    setView("login");
  };

  return (
    <div className="w-full text-center p-8">
      <h2 className="text-4xl font-extrabold text-indigo-700 mb-4">
        Welcome, {user.name}!
      </h2>
      <p className="text-lg text-gray-600 mb-8">
        You have successfully signed in to the application.
      </p>

      <div className="bg-gray-50 p-6 rounded-xl border border-indigo-200 shadow-inner mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Account Details
        </h3>
        <p className="text-md text-gray-700">
          Email: <span className="font-mono text-indigo-600">{user.email}</span>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This is your simulated home dashboard.
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full max-w-xs flex justify-center mx-auto py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:scale-[1.01]"
      >
        Log Out
      </button>
      <button
        // onClick={handleLogout}
        className="w-full max-w-xs flex justify-center mx-auto mt-5 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:scale-[1.01]"
      >
        <Link href="/">Home</Link>
      </button>
    </div>
  );
};

// --- Main Application Component ---
const App = () => {
  // State to toggle between 'login', 'register', and 'home' views
  const [currentView, setCurrentView] = useState("login");
  // State to hold the logged-in user's information
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter']">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 tracking-tight">
          SR Craft Creations
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-2xl rounded-xl sm:px-10 border border-gray-100">
          {currentView === "login" ? (
            <LoginForm
              setView={handleViewChange}
              setLoggedInUser={setLoggedInUser}
            />
          ) : currentView === "register" ? (
            <RegisterForm
              setView={handleViewChange}
              setLoggedInUser={setLoggedInUser}
            />
          ) : (
            <HomePage setView={handleViewChange} user={loggedInUser} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
