import { useState } from "react";
import { Check, Phone, Wrench, Calendar as CalendarIcon, Smartphone } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
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
    setDeliveryDate(undefined);
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
    { days: "1", label: "1 يوم (عاجل جدًا)" },
    { days: "2", label: "2 يوم (عاجل)" },
    { days: "3", label: "3 أيام (عادي)" },
    { days: "5", label: "5 أيام" },
    { days: "7", label: "7 أيام" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information Section */}
      <Card>
        <CardHeader className="card-header-highlight">
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Phone size={18} />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName" className="text-sm font-medium">
                Customer Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="customerName" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name" 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="phoneNumber" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="Enter phone number"
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
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="deviceBrand" className="text-sm font-medium">
                Device Brand <span className="text-red-500">*</span>
              </Label>
              <Select value={deviceBrand} onValueChange={setDeviceBrand} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select device brand" />
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
                Device Model <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="deviceModel" 
                value={deviceModel} 
                onChange={(e) => setDeviceModel(e.target.value)} 
                placeholder="e.g. iPhone 13, Galaxy S21"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imeiNumber" className="text-sm font-medium">
                IMEI Number <span className="text-gray-400">(Optional)</span>
              </Label>
              <Input 
                id="imeiNumber" 
                value={imeiNumber} 
                onChange={(e) => setImeiNumber(e.target.value)} 
                placeholder="Enter IMEI number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviceCondition" className="text-sm font-medium">
                Device Condition <span className="text-red-500">*</span>
              </Label>
              <Select value={deviceCondition} onValueChange={setDeviceCondition} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select device condition" />
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
              Problem Description <span className="text-red-500">*</span>
            </Label>
            <Textarea 
              id="problemDescription" 
              value={problemDescription} 
              onChange={(e) => setProblemDescription(e.target.value)} 
              placeholder="Describe the issue with the device"
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
            Repair Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost" className="text-sm font-medium">
                Estimated Cost ($) <span className="text-red-500">*</span>
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
                Urgency (Days) <span className="text-red-500">*</span>
              </Label>
              <Select value={urgencyDays} onValueChange={setUrgencyDays} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {urgencyOptions.map((option) => (
                    <SelectItem key={option.days} value={option.days}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryDate" className="text-sm font-medium">
                Expected Delivery Date <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="deliveryDate"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deliveryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={status} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">New repair requests are created with pending status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={handleClearForm}>
          Clear Form
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
          Create Repair Order
        </Button>
      </div>
    </form>
  );
};
