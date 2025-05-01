import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ListFilter, LogOut, Wrench, User, Smartphone, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { RepairRequestForm } from "@/components/RepairRequestForm";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success(t("logoutSuccess"));
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-0 md:p-0">
      <header className="w-full px-4 py-6 flex flex-col md:flex-row md:justify-between md:items-center bg-white dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-4">
          <Wrench size={36} className="text-blue-600 dark:text-blue-400" />
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">{t("appTitle")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">{t("systemDescription")}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
            <LogOut size={16} />
            {t("logout")}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 items-start">
        <section className="flex-1 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 flex flex-col items-center text-center">
            <Smartphone size={48} className="text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{t("newRepairOrder")}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              {t("homeIntro", { defaultValue: "Easily create a new repair order for your customer. Fill in the details below and submit the request." })}
            </p>
            <RepairRequestForm />
          </div>
        </section>
        <aside className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center">
            <User size={32} className="text-blue-400 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{t("viewAllOrders")}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm text-center">
              {t("homeOrdersHint", { defaultValue: "See all repair orders, track their status, and manage your workflow." })}
            </p>
            <Link to="/orders" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold flex items-center gap-2 justify-center">
                <ListFilter size={18} />
                {t("viewAllOrders")}
              </Button>
            </Link>
          </div>
          {/* Statistics Navigation Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center mt-2">
            <Wrench size={32} className="text-purple-500 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{t("statistics")}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm text-center">
              {t("statisticsHint", { defaultValue: "View detailed statistics and analytics for your repair orders." })}
            </p>
            <Link to="/statistics" className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-bold flex items-center gap-2 justify-center">
                <LayoutGrid size={18} />
                {t("goToStatistics")}
              </Button>
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Index;
