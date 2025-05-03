
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      // Use replace to prevent back navigation to login page
      navigate("/dashboard", { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  // Don't render anything while checking authentication status
  if (isChecking) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">ZSEE Management</h1>
        <p className="text-muted-foreground">Management System</p>
      </div>
      <LoginForm />
      <p className="mt-8 text-sm text-muted-foreground">
        Demo credentials: admin@example.com / password
      </p>
    </div>
  );
};

export default LoginPage;
