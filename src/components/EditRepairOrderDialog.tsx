import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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

  const deviceConditions = [
    { value: "Good", label: t("deviceConditionGood") },
    { value: "Fair", label: t("deviceConditionFair") },
    { value: "Damaged", label: t("deviceConditionDamaged") },
    { value: "Not Working", label: t("deviceConditionNotWorking") }
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
          <Select value={form.deviceCondition || ""} onValueChange={v => handleChange("deviceCondition", v)}>
            <SelectTrigger>
              <SelectValue>{deviceConditions.find(dc => dc.value === form.deviceCondition)?.label || t("deviceCondition")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {deviceConditions.map((condition) => (
                <SelectItem key={condition.value} value={condition.value}>{condition.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" value={form.estimatedCost || 0} onChange={e => handleChange("estimatedCost", e.target.value)} placeholder="التكلفة" />
        </div>
        <DialogFooter>
          <Button onClick={() => onSave(form)} className="bg-blue-600" disabled={!isValid}>حفظ</Button>
          <Button variant="outline" onClick={onClose}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
