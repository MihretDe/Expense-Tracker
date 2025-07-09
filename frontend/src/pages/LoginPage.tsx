import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginButton from "../auth/LoginButton";

const LoginPage = () => {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center  ">
      {/* Left side */}
      <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 space-y-6 items-center justify-center flex flex-col">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to Expense Tracker</h1>
        <p className="text-gray-600 text-lg">
          Manage your expenses and track your transactions effortlessly.
        </p>
        <LoginButton />
      </div>

      {/* Right side image */}
      <div className="md:w-1/2 min-h-screen hidden md:block">
        <img
          src="/money.svg"
          alt="Money Illustration"
          className="max-h-screen w-full object-cover "
        />
      </div>
    </div>
  );
};

export default LoginPage;
