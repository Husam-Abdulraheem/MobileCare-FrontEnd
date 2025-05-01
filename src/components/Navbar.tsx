import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Home, LogOut, LayoutGrid, ListFilter, Wrench } from "lucide-react";
import { toast } from "sonner";

interface NavbarProps {
  showHome?: boolean;
  showOrders?: boolean;
  showLogout?: boolean;
  showStatistics?: boolean;
}

export const Navbar = ({ showHome = true, showOrders = true, showLogout = true, showStatistics = false }: NavbarProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success(t("logoutSuccess"));
    navigate("/login");
  };

  return (
    <header className="w-full px-4 py-4 flex flex-col md:flex-row md:justify-between md:items-center bg-gradient-to-r from-blue-600 to-blue-400 dark:from-gray-900 dark:to-gray-800 shadow-md rounded-b-lg">
      <div className="flex items-center gap-4">
        <Wrench size={36} className="text-white" />
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">{t('appTitle')}</h1>
          <p className="text-blue-100 dark:text-gray-300 mt-1 text-sm">{t('systemDescription')}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        {showHome && location.pathname !== "/" && (
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-blue-500">
              <Home size={16} />
              {t('backToHome')}
            </Button>
          </Link>
        )}
        {showOrders && location.pathname !== "/orders" && (
          <Link to="/orders">
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-blue-500">
              <ListFilter size={16} />
              {t('viewAllOrders')}
            </Button>
          </Link>
        )}
        {showStatistics && location.pathname !== "/statistics" && (
          <Link to="/statistics">
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-blue-500">
              <LayoutGrid size={16} />
              {t('statistics')}
            </Button>
          </Link>
        )}
        {showLogout && (
          <Button variant="ghost" className="flex items-center gap-2 text-white hover:bg-blue-500" onClick={handleLogout}>
            <LogOut size={16} />
            {t('logout')}
          </Button>
        )}
        <div className="flex items-center gap-2 bg-white/10 rounded px-2 py-1">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};
