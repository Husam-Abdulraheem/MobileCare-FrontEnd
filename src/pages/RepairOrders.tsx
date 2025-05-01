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
import { EditRepairOrderDialog } from "@/components/EditRepairOrderDialog";

// نوع البيانات للطلبات
interface RepairOrder {
  id: string;
  customerName: string;
  phoneNumber: string;
  deviceBrand: string;
  deviceModel: string;
  imeiNumber?: string;
  problemDescription: string;
  deviceCondition: string;
  estimatedCost: number;
  deliveryDate: Date;
  status: "Pending" | "InProgress" | "Ready" | "Collected";
  dateCreated: Date;
  urgencyDays: number;
  technicianId: string;
}

const RepairOrders = () => {
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const navigate = useNavigate();
  
  // البحث والتصفية
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  
  useEffect(() => {
    // Get userId from JWT token in localStorage
    const token = localStorage.getItem("token");
    let userId = 0;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub ? Number(payload.sub) : 0;
      } catch (e) {
        userId = 0;
      }
    }
    axios.get("https://localhost:7042/api/RepairOrders/get-orders-by-user", {
      params: { userId }
    })
      .then(res => {
        const apiOrders = res.data.map((item: any) => ({
          id: item.repairOrderId?.toString() ?? "",
          customerName: item.customerFullName ?? "",
          phoneNumber: item.phoneNumber ?? "",
          deviceBrand: item.brand ?? "",
          deviceModel: item.model ?? "",
          imeiNumber: item.imei ?? "",
          problemDescription: item.problemDescription ?? "",
          deviceCondition: item.deviceCondition ?? "",
          estimatedCost: item.estimatedCost !== undefined ? Number(item.estimatedCost) : 0,
          deliveryDate: item.updatedAt ? new Date(item.updatedAt) : new Date(),
          status: item.status ?? "Pending",
          dateCreated: item.createdAt ? new Date(item.createdAt) : new Date(),
          urgencyDays: 0,
          ProblemDescription: "",
          technicianId: item.userFullName ?? ""
        }));
        setOrders(apiOrders);
      })
      .catch(() => {
        toast.error("فشل في جلب بيانات الطلبات من الخادم");
      });
  }, []);
  
  // الطلبات المعروضة بعد التصفية
  const filteredOrders = orders.filter(order => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return statusFilter === "all" ? true : order.status === statusFilter;
    const matchesSearch =
      (order.customerName && order.customerName.toLowerCase().includes(search)) ||
      (order.phoneNumber && order.phoneNumber.toLowerCase().includes(search)) ||
      (order.deviceBrand && order.deviceBrand.toLowerCase().includes(search)) ||
      (order.deviceModel && order.deviceModel.toLowerCase().includes(search)) ||
      (order.imeiNumber && order.imeiNumber.toLowerCase().includes(search));
    const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // تغيير حالة الطلب
  const handleStatusChange = (orderId: string, newStatus: "Pending" | "InProgress" | "Ready" | "Collected") => {
    const token = localStorage.getItem("token");
    axios.put(
      `https://localhost:7042/api/RepairOrders/update-status`,
      {},
      {
        params: { repairOrderId: orderId, status: newStatus },
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    )
      .then(() => {
        setOrders(orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast.success("تم تحديث حالة الطلب بنجاح");
      })
      .catch(() => {
        toast.error("فشل في تحديث حالة الطلب");
      });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/login");
  };

  const startEdit = (order: RepairOrder) => {
    setEditingOrder({
      id: order.id, // Ensure id is included
      customerFullName: order.customerName,
      phoneNumber: order.phoneNumber,
      brand: order.deviceBrand,
      model: order.deviceModel,
      imei: order.imeiNumber,
      problemDescription: order.problemDescription,
      deviceCondition: order.deviceCondition,
      estimatedCost: order.estimatedCost,
      userFullName: order.technicianId,
      updatedAt: new Date().toISOString(),
      status: order.status
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async (form: any) => {
    const token = localStorage.getItem("token");
    if (!form.id) {
      toast.error("معرّف الطلب غير موجود!");
      return;
    }
    try {
      await axios.put(
        `https://localhost:7042/api/RepairOrders/update-order/${form.id}`,
        form,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setOrders(orders.map(order =>
        order.id === form.id ? {
          ...order,
          customerName: form.customerFullName,
          phoneNumber: form.phoneNumber,
          deviceBrand: form.brand,
          deviceModel: form.model,
          imeiNumber: form.imei,
          problemDescription: form.problemDescription,
          deviceCondition: form.deviceCondition,
          estimatedCost: form.estimatedCost,
          technicianId: form.userFullName,
          status: form.status,
          deliveryDate: new Date(form.updatedAt)
        } : order
      ));
      toast.success("تم تحديث الطلب بنجاح");
      setEditDialogOpen(false);
      setEditingOrder(null);
    } catch {
      toast.error("فشل في تحديث الطلب");
    }
  };
  
  // لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300";
      case "InProgress": return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300";
      case "Ready": return "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300";
      case "Collected": return "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  // ترجمة الحالة إلى العربية
  const translateStatus = (status: string) => {
    switch (status) {
      case "Pending": return "قيد الانتظار";
      case "InProgress": return "قيد التنفيذ";
      case "Ready": return "جاهز";
      case "Collected": return "تم الاستلام";
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
                <SelectItem value="Ready">جاهز</SelectItem>
                <SelectItem value="Collected">تم الاستلام</SelectItem>
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
                  <TableHead>اسم العميل</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>نوع الجهاز / الموديل / IMEI</TableHead>
                  <TableHead>وصف المشكلة</TableHead>
                  <TableHead>حالة الجهاز</TableHead>
                  <TableHead>التكلفة</TableHead>
                  <TableHead>موعد التسليم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الفني</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
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
                        <div className="truncate">{order.problemDescription}</div>
                      </TableCell>
                      <TableCell>{order.deviceCondition}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.estimatedCost} $</TableCell>
                      <TableCell>{format(order.deliveryDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <Select 
                          value={order.status} 
                          onValueChange={(value: "Pending" | "InProgress" | "Ready" | "Collected") => 
                            handleStatusChange(order.id, value)
                          }
                        >
                          <SelectTrigger className={`w-32 ${getStatusColor(order.status)}`}>
                            <SelectValue>{translateStatus(order.status)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">قيد الانتظار</SelectItem>
                            <SelectItem value="InProgress">قيد التنفيذ</SelectItem>
                            <SelectItem value="Ready">جاهز</SelectItem>
                            <SelectItem value="Collected">تم الاستلام</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{order.technicianId}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => startEdit(order)}>تعديل</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <EditRepairOrderDialog
          open={editDialogOpen}
          order={editingOrder}
          onClose={() => { setEditDialogOpen(false); setEditingOrder(null); }}
          onSave={handleEditSave}
        />
      </div>
    </div>
  );
};

export default RepairOrders;
