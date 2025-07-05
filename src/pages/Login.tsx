import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, User, Lock } from "lucide-react";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthContext } from "../App";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { app } from "../firebase";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t('errorRequiredFields'));
      return;
    }
    setIsLoading(true);
    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state will be handled by the useAuth hook
      toast.success(t('successLogin'));
      navigate("/");
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMsg = t('errorLogin');

      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMsg = t('errorUserNotFound') || 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMsg = t('errorWrongPassword') || 'Wrong password';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = t('errorInvalidEmail') || 'Invalid email';
      } else if (error.code === 'auth/too-many-requests') {
        errorMsg = t('errorTooManyRequests') || 'Too many failed attempts. Please try again later.';
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Auth state will be handled by the useAuth hook
      toast.success(t('successLogin'));
      navigate("/");
    } catch (error: any) {
      console.error('Google login error:', error);
      let errorMsg = t('errorLogin');

      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = t('errorPopupClosed') || 'Login popup was closed';
      } else if (error.code === 'auth/popup-blocked') {
        errorMsg = t('errorPopupBlocked') || 'Login popup was blocked. Please allow popups for this site.';
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('appTitle')}</h1>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex justify-center items-center gap-2">
              <LogIn size={24} className="text-blue-600" />
              {t('login')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('systemDescription')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block">{t('username')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="email"
                    placeholder={t('username')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
                <div className="text-right">
                  <a
                    href="/reset-password"
                    className="text-xs text-blue-600 hover:underline mt-1"
                  >
                    {t('forgotPassword', 'Forgot password?')}
                  </a>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">{t('password')}</Label>
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
                {isLoading ? t('loading') : t('login')}
              </Button>
            </CardFooter>
          </form>
          <CardFooter>
            <Button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 mt-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              {t('registerWithGoogle') || t('loginWithGoogle')}
            </Button>
          </CardFooter>
          <CardFooter>
            <div className="w-full text-center mt-2">
              {t('noAccount') || "Don't have an account?"} <a href="/register" className="text-blue-600 hover:underline">{t('register')}</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
