import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { app } from "../firebase";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error(t('errorRequiredFields'));
      return;
    }
    setIsLoading(true);
    const auth = getAuth(app);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(t('resetEmailSent'));
      navigate("/login");
    } catch (error: any) {
      // Try to translate known Firebase error codes
      let errorMsg = '';
      if (error.code === 'auth/user-not-found') {
        errorMsg = t('errorUserNotFound');
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = t('errorInvalidEmail');
      } else {
        errorMsg = t('errorResetPassword');
      }
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {t('resetPassword', 'Reset Password')}
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail" className="text-right block">{t('email')}</Label>
                <div className="relative">
                  <Input
                    id="resetEmail"
                    placeholder={t('emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? t('loading') : t('sendResetLink')}
              </Button>
              <button
                type="button"
                className="text-xs text-gray-500 hover:underline mt-1"
                onClick={() => navigate("/login")}
              >
                {t('backToLogin')}
              </button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
