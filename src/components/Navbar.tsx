import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Home, LogOut, LayoutGrid, ListFilter, Wrench, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-400 dark:from-gray-900 dark:to-gray-800 shadow-md rounded-b-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Wrench size={36} className="text-white" />
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow">{t('appTitle')}</h1>
            <p className="text-blue-100 dark:text-gray-300 mt-1 text-sm">{t('systemDescription')}</p>
          </div>
        </div>
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden flex items-center text-white focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-2 bg-white/10 rounded px-2 py-1 ml-4">
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
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
      {/* Mobile menu (collapsible) */}
      {menuOpen && (
        <div className="flex flex-col gap-2 mt-4 md:hidden bg-white/10 rounded px-2 py-3 animate-fade-in">
          {showHome && location.pathname !== "/" && (
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="flex items-center gap-2 text-blue-700 dark:text-white w-full justify-start">
                <Home size={16} />
                {t('backToHome')}
              </Button>
            </Link>
          )}
          {showOrders && location.pathname !== "/orders" && (
            <Link to="/orders" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="flex items-center gap-2 text-blue-700 dark:text-white w-full justify-start">
                <ListFilter size={16} />
                {t('viewAllOrders')}
              </Button>
            </Link>
          )}
          {showStatistics && location.pathname !== "/statistics" && (
            <Link to="/statistics" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="flex items-center gap-2 text-blue-700 dark:text-white w-full justify-start">
                <LayoutGrid size={16} />
                {t('statistics')}
              </Button>
            </Link>
          )}
          {showLogout && (
            <Button variant="ghost" className="flex items-center gap-2 text-blue-700 dark:text-white w-full justify-start" onClick={() => { setMenuOpen(false); handleLogout(); }}>
              <LogOut size={16} />
              {t('logout')}
            </Button>
          )}
          <div className="flex items-center gap-2 mt-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
};
