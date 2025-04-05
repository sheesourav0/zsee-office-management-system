
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary">ConstructTrack</h1>
        <p className="text-muted-foreground">Construction Project Management System</p>
      </div>
      <LoginForm />
      <p className="mt-8 text-sm text-muted-foreground">
        Demo credentials: admin@example.com / password
      </p>
    </div>
  );
};

export default Login;
