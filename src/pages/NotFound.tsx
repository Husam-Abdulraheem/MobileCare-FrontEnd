import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('notFoundTitle') || 'Oops! Page not found'}</p>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{t('notFoundDescription') || 'The page you are looking for does not exist or has been moved.'}</p>
        <a href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          {t('returnToHome') || 'Return to Home'}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
