import { useState, useEffect } from "react";
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
import { Home, Search, Filter, User, Phone, Smartphone, FileText, DollarSign, Calendar, Clock, LogOut, LayoutGrid, ListFilter, Pencil, Trash2, QrCode } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { EditRepairOrderDialog } from "@/components/EditRepairOrderDialog";
import { useTranslation } from 'react-i18next';
import { Navbar } from "@/components/Navbar";
import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, updateOrderStatus, deleteOrder } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

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
  trackCode?: string;
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

  const [qrOpen, setQrOpen] = useState(false);
  const [qrTrackCode, setQrTrackCode] = useState<string | null>(null);

  useEffect(() => {
    // console.log('RepairOrders component mounted');
    // Get userId from Firebase Auth localStorage (currentUser)
    let userId = null;
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.uid;
      }
    } catch (err) {
      console.error('Error parsing currentUser from localStorage:', err);
    }
    // console.log('userId from localStorage:', userId);
    // Remove error toast for missing userId, just skip fetch
    if (!userId) {
      console.warn('Skipping fetch, no userId');
      setOrders([]);
      return;
    }
    // Fetch orders from Firestore for this user
    const fetchOrders = async () => {
      // console.log('[Firestore] Fetching orders for userId:', userId);
      try {
        const q = query(collection(db, "repairOrders"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        // console.log('[Firestore] Query snapshot:', querySnapshot);
        let fbOrders = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // console.log('[Firestore] Order doc:', doc.id, data);
          return {
            id: doc.id,
            customerName: data.customerName || "",
            phoneNumber: data.phoneNumber || "",
            deviceBrand: data.deviceBrand || "",
            deviceModel: data.deviceModel || "",
            imeiNumber: data.imei || "",
            problemDescription: data.problemDescription || "",
            deviceCondition: data.deviceCondition || "",
            estimatedCost: data.estimatedCost !== undefined ? Number(data.estimatedCost) : 0,
            deliveryDate: data.createdAt ? new Date(data.createdAt) : new Date(),
            status: data.status || "Pending",
            dateCreated: data.createdAt ? new Date(data.createdAt) : new Date(),
            urgencyDays: 0,
            technicianId: data.technicianId || "",
            trackCode: data.trackCode || ""
          };
        });
        // Sort orders by dateCreated descending (newest first)
        fbOrders = fbOrders.sort((a, b) => {
          const aTime = a.dateCreated instanceof Date ? a.dateCreated.getTime() : 0;
          const bTime = b.dateCreated instanceof Date ? b.dateCreated.getTime() : 0;
          return bTime - aTime;
        });
        // console.log('[Firestore] Parsed & sorted orders:', fbOrders);
        setOrders(fbOrders);
      } catch (e) {
        console.error('[Firestore] Error fetching orders:', e);
        toast.error(t('errorFetchOrders'));
      }
    };
    fetchOrders();
  }, [t]);

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

  // تغيير حالة الطلب (Firestore helper)
  const handleStatusChange = async (orderId: string, newStatus: "Pending" | "InProgress" | "Ready" | "Collected") => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(t('successStatusUpdated'));
    } catch {
      toast.error(t('errorStatusUpdate'));
    }
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
    if (!form.id) {
      toast.error(t('errorOrderIdMissing'));
      return;
    }
    try {
      const orderRef = doc(db, "repairOrders", form.id);
      await updateDoc(orderRef, {
        customerName: form.customerFullName,
        phoneNumber: form.phoneNumber,
        deviceBrand: form.brand,
        deviceModel: form.model,
        imei: form.imei,
        problemDescription: form.problemDescription,
        deviceCondition: form.deviceCondition,
        estimatedCost: form.estimatedCost,
        technicianId: form.userFullName,
        status: form.status,
        updatedAt: new Date().toISOString()
      });
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
    try {
      await deleteOrder(orderId);
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

  // Translate device condition
  const translateDeviceCondition = (condition: string) => {
    switch (condition) {
      case "Good": return t('deviceConditionGood');
      case "Fair": return t('deviceConditionFair');
      case "Damaged": return t('deviceConditionDamaged');
      case "Not Working": return t('deviceConditionNotWorking');
      default: return condition;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-0 md:p-0">
      <Navbar showHome={true} showOrders={false} showLogout={true} showStatistics={true} />
      <main className="w-full max-w-[1800px] mx-auto px-2 py-10">
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
          <div className="overflow-x-auto w-full" style={{ minWidth: 320 }}>
            <Table className="min-w-full text-sm md:text-base">
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">{t('customerName')}</TableHead>
                  <TableHead className="min-w-[120px]">{t('phoneNumber')}</TableHead>
                  <TableHead className="min-w-[180px]">{t('deviceBrand')} / {t('deviceModel')} / {t('imei')}</TableHead>
                  <TableHead className="min-w-[120px]">{t('trackCode')}</TableHead>
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
                      <TableCell>{order.trackCode || "-"}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{order.problemDescription}</div>
                      </TableCell>
                      <TableCell>{translateDeviceCondition(order.deviceCondition)}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.estimatedCost} &#65020;</TableCell>
                      <TableCell>{format(order.deliveryDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
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
                          {order.status === "Collected" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="mt-1"
                              onClick={(e) => { e.stopPropagation(); navigate(`/print/${order.id}`); }}
                            >
                              {t('print')}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="outline" onClick={() => startEdit(order)} aria-label={t('edit')}>
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{t('edit')}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="destructive" onClick={() => handleDeleteOrder(order.id)} aria-label={t('delete')}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{t('delete')}</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  onClick={() => { setQrTrackCode(order.trackCode); setQrOpen(true); }}
                                  aria-label={t('showQr')}
                                  disabled={!order.trackCode}
                                >
                                  <QrCode className="w-4 h-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{t('showQr')}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
            <div className="p-4 font-bold text-lg text-blue-700 dark:text-green-300">{t('collectedOrders')}</div>
            <div className="overflow-x-auto w-full" style={{ minWidth: 320 }}>
              <Table className="min-w-full text-sm md:text-base">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">{t('customerName')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('phoneNumber')}</TableHead>
                    <TableHead className="min-w-[180px]">{t('deviceBrand')} / {t('deviceModel')} / {t('imei')}</TableHead>
                    <TableHead className="min-w-[120px]">{t('trackCode')}</TableHead>
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
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.phoneNumber}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{order.deviceBrand}</span> {order.deviceModel}
                        {order.imeiNumber && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">IMEI: {order.imeiNumber}</div>
                        )}
                      </TableCell>
                      <TableCell>{order.trackCode || "-"}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate">{order.problemDescription}</div>
                      </TableCell>
                      <TableCell>{translateDeviceCondition(order.deviceCondition)}</TableCell>
                      <TableCell dir="ltr" className="text-right">{order.estimatedCost} &#65020;</TableCell>
                      <TableCell>{format(order.deliveryDate, 'dd/MM/yyyy')}</TableCell>
                      <TableCell>
                        <span className={`w-32 ${getStatusColor(order.status)}`}>{translateStatus(order.status)}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => navigate(`/print/${order.id}`)}
                        >
                          {t('print')}
                        </Button>
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
        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('trackCode')}</DialogTitle>
            </DialogHeader>
            {qrTrackCode && (
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG value={`${window.location.origin}/track?code=${qrTrackCode}`} size={200} />
                <div className="text-center text-sm text-gray-600">{t('scanQrToTrack')}</div>
                <div className="text-xs text-gray-400 break-all">{`${window.location.origin}/track?code=${qrTrackCode}`}</div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default RepairOrders;
