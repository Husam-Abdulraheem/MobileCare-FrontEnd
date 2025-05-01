import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditRepairOrderDialogProps {
  open: boolean;
  order: any;
  onClose: () => void;
  onSave: (updated: any) => void;
}

export function EditRepairOrderDialog({ open, order, onClose, onSave }: EditRepairOrderDialogProps) {
  const [form, setForm] = useState(order || {});

  const deviceBrands = [
    "Apple",
    "Samsung",
    "Google",
    "Xiaomi",
    "Huawei",
    "OnePlus",
    "Motorola",
    "Sony",
    "LG",
    "Nokia",
    "Other"
  ];

  useEffect(() => {
    setForm(order || {});
  }, [order]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const isValid = form && form.customerFullName && form.phoneNumber && form.brand && form.model && form.problemDescription;

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل الطلب</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input value={form.customerFullName || ""} onChange={e => handleChange("customerFullName", e.target.value)} placeholder="اسم العميل" />
          <Input value={form.phoneNumber || ""} onChange={e => handleChange("phoneNumber", e.target.value)} placeholder="رقم الهاتف" />
          <Select value={form.brand || ""} onValueChange={v => handleChange("brand", v)}>
            <SelectTrigger>
              <SelectValue>{form.brand || "اختر نوع الجهاز"}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {deviceBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input value={form.model || ""} onChange={e => handleChange("model", e.target.value)} placeholder="الموديل" />
          <Input value={form.imei || ""} onChange={e => handleChange("imei", e.target.value)} placeholder="IMEI" />
          <Textarea value={form.problemDescription || ""} onChange={e => handleChange("problemDescription", e.target.value)} placeholder="المشكلة" />
          <Input value={form.deviceCondition || ""} onChange={e => handleChange("deviceCondition", e.target.value)} placeholder="حالة الجهاز" />
          <Input type="number" value={form.estimatedCost || 0} onChange={e => handleChange("estimatedCost", e.target.value)} placeholder="التكلفة" />
          <Input value={form.userFullName || ""} onChange={e => handleChange("userFullName", e.target.value)} placeholder="الفني" />
          <Select value={form.status || "Pending"} onValueChange={v => handleChange("status", v)}>
            <SelectTrigger className="w-32">
              <SelectValue>{form.status}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">قيد الانتظار</SelectItem>
              <SelectItem value="InProgress">قيد التنفيذ</SelectItem>
              <SelectItem value="Ready">جاهز</SelectItem>
              <SelectItem value="Collected">تم الاستلام</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button onClick={() => onSave(form)} className="bg-blue-600" disabled={!isValid}>حفظ</Button>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
