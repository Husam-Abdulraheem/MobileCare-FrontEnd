import { useState, useEffect } from "react";
import axios from "axios";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
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
import { Home, Search, Filter, User, Phone, Smartphone, FileText, DollarSign, Calendar, Clock, LogOut, LayoutGrid, ListFilter } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EditRepairOrderDialog } from "@/components/EditRepairOrderDialog";
import { useTranslation } from 'react-i18next';
import { Navbar } from "@/components/Navbar";

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
  const { t } = useTranslation();
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
        toast.error(t('errorFetchOrders'));
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

  // Filter out collected orders for main table
  const activeOrders = filteredOrders.filter(order => order.status !== "Collected");
  const collectedOrders = filteredOrders.filter(order => order.status === "Collected");
  
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
        toast.success(t('successStatusUpdated'));
      })
      .catch(() => {
        toast.error(t('errorStatusUpdate'));
      });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    toast.success(t('successLogout'));
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
      toast.error(t('errorOrderIdMissing'));
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
      toast.success(t('successOrderUpdated'));
      setEditDialogOpen(false);
      setEditingOrder(null);
    } catch {
      toast.error(t('errorOrderUpdate'));
    }
  };

  // Delete order handler
  const handleDeleteOrder = async (orderId: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`https://localhost:7042/api/RepairOrders/delete-order/${orderId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setOrders(orders.filter(order => order.id !== orderId));
      toast.success(t('successOrderDeleted'));
    } catch (error) {
      toast.error(t('errorOrderDelete'));
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
  
  // Translate status 
  const translateStatus = (status: string) => {
    switch (status) {
      case "Pending": return t('pending');
      case "InProgress": return t('inProgress');
      case "Ready": return t('ready');
      case "Collected": return t('collected');
      default: return status;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-0 md:p-0">
      <Navbar showHome={true} showOrders={false} showLogout={true} showStatistics={true} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-gray-900 rounded-lg shadow px-4 py-3">
            <Search className="text-gray-400" size={20} />
            <Input
              placeholder={t('searchPlaceholder')}
              className="border-0 bg-transparent focus:ring-0 focus:border-blue-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filterByStatus')}</SelectItem>
                <SelectItem value="Pending">{t('pending')}</SelectItem>
                <SelectItem value="InProgress">{t('inProgress')}</SelectItem>
                <SelectItem value="Ready">{t('ready')}</SelectItem>
                <SelectItem value="Collected">{t('collected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md mb-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-16 text-center">{t('id')}</TableHead>
                  <TableHead className="min-w-[120px]">{t('customerName')}</TableHead>
                  <TableHead className="min-w-[120px]">{t('phoneNumber')}</TableHead>
                  <TableHead className="min-w-[180px]">{t('deviceBrand')} / {t('deviceModel')} / {t('imei')}</TableHead>
                  <TableHead className="min-w-[180px]">{t('problemDescription')}</TableHead>
                  <TableHead className="min-w-[120px]">{t('deviceCondition')}</TableHead>
                  <TableHead className="min-w-[100px] text-right">{t('estimatedCost')}</TableHead>
                  <TableHead className="min-w-[120px]">{t('deliveryDate')}</TableHead>
                  <TableHead className="min-w-[100px]">{t('status')}</TableHead>
                  <TableHead className="w-32 text-center">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                      {t('noMatchingOrders')}
                    </TableCell>
                  </TableRow>
                ) : (
                  activeOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition group">
                      <TableCell className="font-medium text-center">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.phoneNumber}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{order.deviceBrand}</span> {order.deviceModel}
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
                            <SelectItem value="Pending">{t('pending')}</SelectItem>
                            <SelectItem value="InProgress">{t('inProgress')}</SelectItem>
                            <SelectItem value="Ready">{t('ready')}</SelectItem>
                            <SelectItem value="Collected">{t('collected')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(order)}>{t('edit')}</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteOrder(order.id)}>
                            {t('delete')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Collected Orders Table */}
        {collectedOrders.length > 0 && (
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md">
            <div className="p-4 font-bold text-lg text-green-700 dark:text-green-300">{t('collectedOrders')}</div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold w-16 text-center">{t('id')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('customerName')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('phoneNumber')}</TableHead>
                    <TableHead className="min-w-[180px]">{t('deviceBrand')} / {t('deviceModel')} / {t('imei')}</TableHead>
                    <TableHead className="min-w-[180px]">{t('problemDescription')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('deviceCondition')}</TableHead>
                    <TableHead className="min-w-[100px] text-right">{t('estimatedCost')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('deliveryDate')}</TableHead>
                    <TableHead className="min-w-[100px]">{t('status')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collectedOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-blue-50 dark:hover:bg-gray-700 transition group">
                      <TableCell className="font-medium text-center">{order.id}</TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.phoneNumber}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{order.deviceBrand}</span> {order.deviceModel}
                        {order.imeiNumber && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">IMEI: {order.imeiNumber}</div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{order.problemDescription}</div>
                      </TableCell>
                      <TableCell>{order.deviceCondition}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.estimatedCost} $</TableCell>
                      <TableCell>{format(order.deliveryDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <span className={`w-32 ${getStatusColor(order.status)}`}>{translateStatus(order.status)}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        <EditRepairOrderDialog
          open={editDialogOpen}
          order={editingOrder}
          onClose={() => { setEditDialogOpen(false); setEditingOrder(null); }}
          onSave={handleEditSave}
        />
      </main>
    </div>
  );
};

export default RepairOrders;
