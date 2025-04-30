
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, User, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Mock credentials for demonstration
  const mockUsers = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "tech", password: "tech123", role: "technician" }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find(
        u => u.username === username && u.password === password
      );

      setIsLoading(false);

      if (user) {
        // In a real app, you would store auth token in localStorage or use a state management library
        localStorage.setItem("currentUser", JSON.stringify({ 
          username: user.username, 
          role: user.role, 
          id: `TECH-${Math.floor(Math.random() * 1000)}` 
        }));
        
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
      } else {
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">MobileCare</h1>
          <ThemeToggle />
        </div>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex justify-center items-center gap-2">
              <LogIn size={24} className="text-blue-600" />
              تسجيل الدخول
            </CardTitle>
            <CardDescription className="text-center">
              أدخل بيانات الدخول للوصول إلى نظام إدارة طلبات الإصلاح
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-right block">اسم المستخدم</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="username"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">كلمة المرور</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "دخول"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>للتجربة استخدم:</p>
          <p>اسم المستخدم: admin | كلمة المرور: admin123</p>
          <p>أو</p>
          <p>اسم المستخدم: tech | كلمة المرور: tech123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
