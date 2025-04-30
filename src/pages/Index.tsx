
import { ThemeToggle } from "@/components/ThemeToggle";
import { RepairRequestForm } from "@/components/RepairRequestForm";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ListFilter, LogOut } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">MobileCare</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">نظام إدارة طلبات الإصلاح</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/orders">
              <Button variant="outline" className="flex items-center gap-2">
                <ListFilter size={16} />
                عرض جميع الطلبات
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              تسجيل الخروج
            </Button>
            <ThemeToggle />
          </div>
        </header>
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">طلب إصلاح جديد</h2>
        </div>
        
        <RepairRequestForm />
      </div>
    </div>
  );
};

export default Index;
