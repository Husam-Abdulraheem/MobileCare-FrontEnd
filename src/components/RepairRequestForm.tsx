import { useState } from "react";
import { Check, Phone, Wrench, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { PreviousRepairs } from "./PreviousRepairs";

interface Customer {
  name: string;
  phone: string;
}

interface RepairOrder {
  id: string;
  dateCreated: Date;
  deviceBrand: string;
  deviceModel: string;
  problemDescription: string;
  status: string;
  estimatedCost: number;
}

export const RepairRequestForm = () => {
  // Form state
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [imeiNumber, setImeiNumber] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [deviceCondition, setDeviceCondition] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");
  const [urgencyDays, setUrgencyDays] = useState("3");
  const [status] = useState("Pending");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!customerName || !phoneNumber || !deviceBrand || !deviceModel || !problemDescription || !estimatedCost || !deviceCondition) {
      toast.error(t('errorRequiredFields'));
      return;
    }
    try {
      const userId = 1;
      await axios.post("https://localhost:7042/api/RepairOrders/create-order", {
        customerName,
        phoneNumber,
        deviceBrand,
        deviceModel,
        imeiNumber,
        problemDescription,
        deviceCondition,
        estimatedCost: Number(estimatedCost),
        userId
      });
      toast.success(t('successOrderCreated'));
      handleClearForm();
    } catch (error) {
      toast.error(t('errorOrderCreate'));
    }
  };

  const handleClearForm = () => {
    setCustomerName("");
    setPhoneNumber("");
    setDeviceBrand("");
    setDeviceModel("");
    setImeiNumber("");
    setProblemDescription("");
    setDeviceCondition("");
    setEstimatedCost("");
    setUrgencyDays("3");
    toast.info(t('infoFormCleared'));
  };

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
    "Good",
    "Fair",
    "Damaged",
    "Not Working"
  ];
  
  const urgencyOptions = [
    { days: "1", label: t("urgency1") },
    { days: "2", label: t("urgency2") },
    { days: "3", label: t("urgency3") },
    { days: "5", label: t("urgency5") },
    { days: "7", label: t("urgency7") }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information Section */}
      <Card>
        <CardHeader className="card-header-highlight">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Phone size={18} />
            {t('customerInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm font-medium">
                {t('customerName')} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="customerName" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={t('enterCustomerName')}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                {t('phoneNumber')} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="phoneNumber" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder={t('enterPhoneNumber')}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Information Section */}
      <Card>
        <CardHeader className="card-header-highlight">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Smartphone size={18} />
            {t('deviceInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deviceBrand" className="text-sm font-medium">
                {t('deviceBrand')} <span className="text-red-500">*</span>
              </Label>
              <Select value={deviceBrand} onValueChange={setDeviceBrand} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDeviceBrand')} />
                </SelectTrigger>
                <SelectContent>
                  {deviceBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceModel" className="text-sm font-medium">
                {t('deviceModel')} <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="deviceModel" 
                value={deviceModel} 
                onChange={(e) => setDeviceModel(e.target.value)} 
                placeholder={t('enterDeviceModel')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imeiNumber" className="text-sm font-medium">
                {t('imei')} <span className="text-gray-400">({t('optional')})</span>
              </Label>
              <Input 
                id="imeiNumber" 
                value={imeiNumber} 
                onChange={(e) => setImeiNumber(e.target.value)} 
                placeholder={t('enterIMEI')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceCondition" className="text-sm font-medium">
                {t('deviceCondition')} <span className="text-red-500">*</span>
              </Label>
              <Select value={deviceCondition} onValueChange={setDeviceCondition} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectDeviceCondition')} />
                </SelectTrigger>
                <SelectContent>
                  {deviceConditions.map((condition) => (
                    <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemDescription" className="text-sm font-medium">
              {t('problemDescription')} <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="problemDescription" 
              value={problemDescription} 
              onChange={(e) => setProblemDescription(e.target.value)} 
              placeholder={t('describeIssue')}
              className="min-h-[120px]"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Repair Order Details Section */}
      <Card>
        <CardHeader className="card-header-highlight">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Wrench size={18} />
            {t('repairOrderDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost" className="text-sm font-medium">
                {t('estimatedCost')} ($) <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="estimatedCost" 
                type="number"
                min="0"
                step="0.01"
                value={estimatedCost} 
                onChange={(e) => setEstimatedCost(e.target.value)} 
                placeholder="0.00"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="urgencyDays" className="text-sm font-medium">
                {t('urgencyDays')} <span className="text-red-500">*</span>
              </Label>
              <Select value={urgencyDays} onValueChange={setUrgencyDays} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('selectUrgencyLevel')} />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((option) => (
                    <SelectItem key={option.days} value={option.days}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                {t('status')}
              </Label>
              <Select value={status} disabled>
                <SelectTrigger>
                  <SelectValue placeholder={t('status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">{t('pending')}</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('newRequestsPending')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleClearForm}>
          {t('clearForm')}
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
          {t('createRepairOrder')}
        </Button>
      </div>
    </form>
  );
};
