import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Home, Building2, ChevronRight } from "lucide-react";
import { Head, Link, useForm } from "@inertiajs/react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [accountType, setAccountType] = useState("user"); // "user" or "company"

  const { data, setData, post, processing, errors, reset, setError, clearErrors } =
    useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      account_type: "user", // Default value
      company_name: "",
      business_type: "",
    });

  useEffect(() => {
    return () => reset("password", "password_confirmation");
  }, []);

  useEffect(() => {
    // Update form data when account type changes
    setData("account_type", accountType);
  }, [accountType]);

  const validate = () => {
    const newErrors = {};
    
    // Step 1 validation
    if (currentStep === 1) {
      if (!accountType) newErrors.account_type = "Please select an account type";
      
      if (accountType === "company") {
        if (!data.company_name) newErrors.company_name = "Company name is required";
        if (!data.business_type) newErrors.business_type = "Business type is required";
      }
    }
    
    // Step 2 validation
    if (currentStep === 2) {
      if (!data.name) newErrors.name = "Name is required";
      else if (data.name.length > 50)
        newErrors.name = "Name cannot exceed 50 characters";

      if (!data.email) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(data.email))
        newErrors.email = "Please enter a valid email address";
      else if (data.email.length > 100)
        newErrors.email = "Email cannot exceed 100 characters";
    }
    
    // Step 3 validation
    if (currentStep === 3) {
      if (!data.password) newErrors.password = "Password is required";
      else if (data.password.length < 8)
        newErrors.password = "Password must be at least 8 characters";
      else if (data.password.length > 50)
        newErrors.password = "Password cannot exceed 50 characters";

      if (data.password_confirmation !== data.password)
        newErrors.password_confirmation = "Passwords do not match";
    }

    return newErrors;
  };

  const handleNextStep = () => {
    clearErrors();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) =>
        setError(key, message)
      );
      setNotification({ type: "error", message: "Please fix the errors below." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    clearErrors();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([key, message]) =>
        setError(key, message)
      );
      setNotification({ type: "error", message: "Please fix the errors below." });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    post(route("register"), {
      onSuccess: () => {
        setNotification({ type: "success", message: "Registration successful! Redirecting..." });
        setTimeout(() => setNotification(null), 2000);
      },
      onError: () => {
        setNotification({ type: "error", message: "Registration failed. Please try again." });
        setTimeout(() => setNotification(null), 3000);
      },
    });
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`rounded-full h-10 w-10 flex items-center justify-center font-medium
                  ${currentStep === step 
                    ? "bg-blue-600 text-white" 
                    : currentStep > step 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-700 text-gray-300"}`}
              >
                {step}
              </div>
              {step < 3 && (
                <ChevronRight className={`w-5 h-5 ${currentStep > step ? "text-green-500" : "text-gray-500"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">Choose Account Type</h3>
              <p className="text-sm text-gray-400 mt-2">Select the type of account you want to create</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                  accountType === "user"
                    ? "border-blue-500 bg-blue-600/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                }`}
                onClick={() => setAccountType("user")}
              >
                <User className={`w-12 h-12 mb-4 ${accountType === "user" ? "text-blue-400" : "text-gray-400"}`} />
                <h4 className="text-lg font-medium text-white">Individual</h4>
                <p className="text-sm text-gray-400 text-center mt-2">For personal travel and experiences</p>
              </div>
              
              <div
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all flex flex-col items-center ${
                  accountType === "company"
                    ? "border-blue-500 bg-blue-600/20"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-500"
                }`}
                onClick={() => setAccountType("company")}
              >
                <Building2 className={`w-12 h-12 mb-4 ${accountType === "company" ? "text-blue-400" : "text-gray-400"}`} />
                <h4 className="text-lg font-medium text-white">Company</h4>
                <p className="text-sm text-gray-400 text-center mt-2">For travel agencies and businesses</p>
              </div>
            </div>
            
            {accountType === "company" && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={data.company_name}
                    onChange={(e) => setData("company_name", e.target.value)}
                    className={`w-full py-3 px-4 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.company_name ? "border-red-500" : ""
                    }`}
                    placeholder="Your Company Name"
                  />
                  {errors.company_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.company_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Business Type
                  </label>
                  <select
                    value={data.business_type}
                    onChange={(e) => setData("business_type", e.target.value)}
                    className={`w-full py-3 px-4 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      errors.business_type ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Select Business Type</option>
                    <option value="travel_agency">Travel Agency</option>
                    <option value="hotel">Hotel/Accommodation</option>
                    <option value="tour_operator">Tour Operator</option>
                    <option value="transport">Transportation</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.business_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.business_type}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">Personal Information</h3>
              <p className="text-sm text-gray-400 mt-2">Tell us who you are</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Your Name"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className={`pl-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white">Set Password</h3>
              <p className="text-sm text-gray-400 mt-2">Create a secure password for your account</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={data.password_confirmation}
                  onChange={(e) => setData("password_confirmation", e.target.value)}
                  className={`pl-10 pr-10 w-full py-3 rounded-lg border bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.password_confirmation ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderStepButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}
        
        <button
          type="button"
          onClick={handleNextStep}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center space-x-2"
          disabled={processing}
        >
          <span>
            {currentStep === 3
              ? processing
                ? "Creating Account..."
                : "Complete Registration"
              : "Next"}
          </span>
          {currentStep < 3 && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-cover bg-center bg-no-repeat relative" 
      style={{ backgroundImage: "url('/images/world.svg')" }}
    >
      <Head title="Register - Travel Nest" />

      {/* Back to Home Button */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        <Home className="w-5 h-5" />
        <span className="font-medium">Home</span>
      </Link>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white ${
              notification.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side Branding - Only visible on larger screens */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <div className="text-center space-y-8">
          <div className="bg-blue-600/20 p-6 rounded-full inline-block mx-auto">
            {accountType === "company" ? (
              <Building2 className="w-20 h-20 text-blue-500" />
            ) : (
              <User className="w-20 h-20 text-blue-500" />
            )}
          </div>
          <h1 className="text-5xl font-bold text-white">
            Join <span className="text-blue-500">Travel Nest</span>
          </h1>
          <p className="text-gray-300 max-w-md mx-auto text-lg">
            {accountType === "company"
              ? "Create a business account to showcase your services and connect with travelers around the world."
              : "Create an account to start planning your next adventure. Discover new destinations and explore the world with us."}
          </p>
        </div>
      </div>

      {/* Right Side - Multi-step Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md p-8 rounded-xl shadow-xl bg-gray-800/90 backdrop-blur-sm">
          {renderStepIndicator()}
          {renderStepContent()}
          {renderStepButtons()}
          
          {/* Sign in link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              href={route("user.login")}
              className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;