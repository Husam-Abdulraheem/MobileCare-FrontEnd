import { ThemeToggle } from "@/components/ThemeToggle";
import { RepairRequestForm } from "@/components/RepairRequestForm";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ListFilter, LogOut } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface RepairOrder {
  id: string;
  dateCreated: Date;
  deviceBrand: string;
  deviceModel: string;
  problemDescription: string;
  status: string;
  estimatedCost: number;
}

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success(t("logoutSuccess"));
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("appTitle")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t("systemDescription")}</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/orders">
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter size={16} />
                {t("viewAllOrders")}
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              {t("logout")}
            </Button>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </header>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t("newRepairOrder")}</h2>
        </div>
        
        <RepairRequestForm />
      </div>
    </div>
  );
};

export default Index;
