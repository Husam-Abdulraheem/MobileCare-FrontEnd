import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Lock, LogIn } from "lucide-react";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthContext } from "../App";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { app } from "../firebase";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast.error(t('errorRequiredFields'));
      return;
    }
    setIsLoading(true);
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName
      });

      // Also save user info in a new collection (e.g., userProfiles)
      await setDoc(doc(db, "userProfiles", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName,
        createdAt: new Date().toISOString()
      });

      // Auth state will be handled by the useAuth hook
      toast.success(t('successRegister'));
      navigate("/");
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMsg = t('errorRegister');

      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = t('errorEmailInUse') || 'Email already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = t('errorInvalidEmail') || 'Invalid email';
      } else if (error.code === 'auth/weak-password') {
        errorMsg = t('errorWeakPassword') || 'Password is too weak';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMsg = t('errorOperationNotAllowed') || 'Email/password accounts are not enabled';
      }

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || ""
      });

      // Also save user info in a new collection (e.g., userProfiles)
      await setDoc(doc(db, "userProfiles", user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: user.displayName || "",
        createdAt: new Date().toISOString()
      });

      // Auth state will be handled by the useAuth hook
      toast.success(t('successRegister'));
      navigate("/");
    } catch (error: any) {
      console.error('Google registration error:', error);
      let errorMsg = t('errorRegister');

      if (error.code === 'auth/popup-closed-by-user') {
        errorMsg = t('errorPopupClosed') || 'Registration popup was closed';
      } else if (error.code === 'auth/popup-blocked') {
        errorMsg = t('errorPopupBlocked') || 'Registration popup was blocked. Please allow popups for this site.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMsg = t('errorAccountExists') || 'An account already exists with the same email address but different sign-in credentials.';
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
              {t('register')}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-right block">{t('fullName', 'Full Name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="fullName"
                    placeholder={t('fullName', 'Full Name')}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10"
                    autoComplete="name"
                  />
                </div>
              </div>
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
                    autoComplete="new-password"
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
                {isLoading ? t('loading') : t('register')}
              </Button>
            </CardFooter>
          </form>
          <CardFooter>
            <Button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 mt-2"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              {t('registerWithGoogle') || t('loginWithGoogle')}
            </Button>
          </CardFooter>
          <CardFooter>
            <div className="w-full text-center mt-2">
              {t('haveAccount', 'Already have an account?')} <a href="/login" className="text-blue-600 hover:underline">{t('login', 'Login')}</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
