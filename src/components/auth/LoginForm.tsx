
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    
    try {
      // Simulate authentication with Admin/Admin credentials
      if (email === "Admin" && password === "Admin") {
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify({ 
          name: "Admin User", 
          email: "admin@example.com", 
          role: "admin" 
        }));
        
        toast.success("Login successful!");
        
        // Navigate after a slight delay to ensure localStorage is updated
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } else {
        toast.error("Invalid credentials. Use Admin / Admin");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleLogin}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Username</label>
            <Input
              id="email"
              type="text"
              placeholder="Admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
