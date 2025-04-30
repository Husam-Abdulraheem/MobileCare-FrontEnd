import { useState, useEffect } from "react";
import axios from "axios";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Filter, User, Phone, Smartphone, FileText, DollarSign, Calendar, Clock, LogOut } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// نوع البيانات للطلبات
interface RepairOrder {
  id: string;
  customerName: string;
  phoneNumber: string;
  deviceBrand: string;
  deviceModel: string;
  imeiNumber?: string;
  issueDescription: string;
  deviceCondition: string;
  estimatedCost: number;
  deliveryDate: Date;
  status: "Pending" | "InProgress" | "Completed" | "Cancelled";
  dateCreated: Date;
  urgencyDays: number;
  notes?: string;
  technicianId: string;
}

const RepairOrders = () => {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const navigate = useNavigate();
  
  // البحث والتصفية
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  useEffect(() => {
    const userId = 1; // or get from auth context
    axios.get("https://localhost:7042/api/RepairOrders/get-orders-by-user", {
      params: { userId: userId },
    })
      .then(res => {
        const apiOrders = res.data.map((item: any) => ({
          id: item.repairOrderId?.toString(),
          customerName: item.customerFullName,
          phoneNumber: item.phoneNumber,
          deviceBrand: item.brand,
          deviceModel: item.model,
          imeiNumber: item.imei,
          issueDescription: item.problemDescription,
          deviceCondition: item.deviceCondition,
          deliveryDate: item.updatedAt,
          status: item.status,
          dateCreated: item.createdAt,
          userFullName: item.userFullName
        }));
        setOrders(apiOrders);
      })
      .catch(() => {
        toast.error("Failed to fetch request data from server");
      });
  }, [])
  
  // الطلبات المعروضة بعد التصفية
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phoneNumber.includes(searchTerm) ||
      order.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.imeiNumber && order.imeiNumber.includes(searchTerm));
      
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // تغيير حالة الطلب
  const handleStatusChange = (orderId: string, newStatus: "Pending" | "InProgress" | "Completed" | "Cancelled") => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };
  
  // لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300";
      case "InProgress": return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300";
      case "Completed": return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300";
      case "Cancelled": return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // ترجمة الحالة إلى العربية
  const translateStatus = (status: string) => {
    switch (status) {
      case "Pending": return "قيد الانتظار";
      case "InProgress": return "قيد التنفيذ";
      case "Completed": return "مكتمل";
      case "Cancelled": return "ملغي";
      default: return status;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">MobileCare</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">جميع طلبات الإصلاح</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home size={16} />
                العودة للرئيسية
              </Button>
            </Link>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              تسجيل الخروج
            </Button>
            <ThemeToggle />
          </div>
        </header>
        
        {/* أدوات البحث والتصفية */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="البحث بالاسم، رقم الهاتف، الموديل، أو IMEI"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="تصفية بالحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="Pending">قيد الانتظار</SelectItem>
                <SelectItem value="InProgress">قيد التنفيذ</SelectItem>
                <SelectItem value="Completed">مكتمل</SelectItem>
                <SelectItem value="Cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* جدول الطلبات */}
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">رقم الطلب</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      اسم العميل
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      رقم الهاتف
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} />
                      نوع الجهاز
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <FileText size={16} />
                      المشكلة
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      التكلفة
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      موعد التسليم
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      الحالة
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      لا توجد طلبات مطابقة للبحث
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.phoneNumber}</TableCell>
                      <TableCell>
                        {order.deviceBrand} {order.deviceModel}
                        {order.imeiNumber && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            IMEI: {order.imeiNumber}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{order.issueDescription}</div>
                      </TableCell>
                      <TableCell dir="ltr" className="text-right">{order.estimatedCost} ريال</TableCell>
                      <TableCell>{format(order.deliveryDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(value: "Pending" | "InProgress" | "Completed" | "Cancelled") => 
                            handleStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className={`w-32 ${getStatusColor(order.status)}`}>
                            <SelectValue>{translateStatus(order.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">قيد الانتظار</SelectItem>
                            <SelectItem value="InProgress">قيد التنفيذ</SelectItem>
                            <SelectItem value="Completed">مكتمل</SelectItem>
                            <SelectItem value="Cancelled">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairOrders;
