import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import useAuthStore from "@/stores/authStore";
import API from "@/services/api/API";
import notification from "@/services/notification/NotificationService";

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    userName: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, setLoading } = useAuthStore();
  const notify = notification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userName.trim() || !formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoading(true);

    try {
      console.log('Attempting login with:', { userName: formData.userName });
      
      const response = await API.post('/api/Users/Login', {
        userName: formData.userName,
        password: formData.password
      });

      console.log('Login response:', response.data);

      if (response.data) {
        const userData = response.data;
        
        // Verify admin status
        if (userData.admin === true) {
          // Store in Zustand store (which persists to sessionStorage)
          login(userData);
          
          notify.success("Login successful! Welcome back.");
          
          // Navigate to home page
          navigate('/');
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Admin login error:', error);
      
      let errorMessage = "Network error. Please check your connection.";
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = "Cannot connect to server. Please check if the API server is running and accessible.";
      } else if (error.response) {
        // Server responded with error status
        errorMessage = error.response?.data?.message || 
                      error.response?.data?.error || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your network connection.";
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      notify.error(errorMessage);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#A7E6FF] via-[#3ABEF9] to-[#3572EF]">
      {/* Header */}
      <header className="bg-[#050C9C] text-white shadow-lg">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3 sm:gap-4">
              <img 
                src="/src/Assets/upescc.jpeg" 
                alt="College Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-lg bg-white/10 p-1"
              />
              <div className="text-center">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  Admin Portal
                </h1>
                <p className="text-xs sm:text-sm opacity-90 mt-1">
                  Administrative Access
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-2 sm:px-4 py-8 sm:py-12 lg:py-16 min-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-120px)]">
        <div className="flex items-center justify-center h-full max-w-7xl mx-auto">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <Card className="w-full mx-auto min-h-[400px] shadow-2xl bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl text-center text-[#050C9C] font-bold">
                  Admin Login
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="userName" className="text-lg font-medium">
                      Username *
                    </Label>
                    <Input
                      id="userName"
                      name="userName"
                      type="text"
                      value={formData.userName}
                      onChange={handleChange}
                      required
                      placeholder="Enter your username"
                      className="h-14 text-lg px-4"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="password" className="text-lg font-medium">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="h-14 text-lg px-4"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#050C9C] hover:bg-[#050C9C]/90 h-14 text-lg text-white font-semibold mt-8"
                    disabled={isLoading || !formData.userName.trim() || !formData.password.trim()}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <div className="text-center mt-6">
                    <p className="text-lg text-gray-600">
                      Administrative access only
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}