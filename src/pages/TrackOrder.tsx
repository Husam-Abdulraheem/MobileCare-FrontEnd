import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getOrderByTrackCode } from "@/lib/firestore-helpers";

const TrackOrder = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [trackCode, setTrackCode] = useState("");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOrder(null);
    setError("");
    if (!trackCode.trim()) {
      setError(t("errorRequiredFields") || "Please enter your track code.");
      return;
    }
    setLoading(true);
    try {
      const orderData = await getOrderByTrackCode(trackCode.trim());
      if (!orderData) {
        setError(t("notFoundDescription") || "Order not found.");
        setOrder(null);
      } else {
        setOrder(orderData);
      }
    } catch (err: any) {
      console.error('Track order error:', err);
      // Handle specific error messages from the helper
      if (err.message.includes('Access denied')) {
        setError("Service temporarily unavailable. Please contact support.");
      } else if (err.message.includes('Service temporarily unavailable')) {
        setError("Service temporarily unavailable. Please try again later.");
      } else if (err.message.includes('Authentication required')) {
        setError("Service configuration error. Please contact support.");
      } else {
        setError(t("notFoundDescription") || "Order not found.");
      }
    } finally {
      setLoading(false);
    }
  };

  // On mount, check for code in URL and auto-fetch if present
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setTrackCode(codeFromUrl);
      // Auto-fetch order
      (async () => {
        setOrder(null);
        setError("");
        setLoading(true);
        try {
          const orderData = await getOrderByTrackCode(codeFromUrl.trim());
          if (!orderData) {
            setError(t("notFoundDescription") || "Order not found.");
            setOrder(null);
          } else {
            setOrder(orderData);
          }
        } catch (err: any) {
          console.error('Track order error:', err);
          // Handle specific error messages from the helper
          if (err.message.includes('Access denied')) {
            setError("Service temporarily unavailable. Please contact support.");
          } else if (err.message.includes('Service temporarily unavailable')) {
            setError("Service temporarily unavailable. Please try again later.");
          } else if (err.message.includes('Authentication required')) {
            setError("Service configuration error. Please contact support.");
          } else {
            setError(t("notFoundDescription") || "Order not found.");
          }
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams, t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="w-full max-w-md flex justify-between items-center mb-6">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-blue-700 dark:text-blue-400">{t("trackCode")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder={t("trackCode") || "Track Code"}
              value={trackCode}
              onChange={e => setTrackCode(e.target.value)}
              required
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {t("submit")}
            </Button>
          </form>
          {loading && <div className="text-center mt-4 text-blue-500">{t("loading")}</div>}
          {error && <div className="text-center mt-4 text-red-500">{error}</div>}
          {order && (
            <div className="mt-6 space-y-2 border-t pt-4 text-right">
              <div><b>{t("customerName")}</b>: {order.customerName}</div>
              <div><b>{t("deviceBrand")}</b>: {order.brand}</div>
              <div><b>{t("deviceModel")}</b>: {order.model}</div>
              {order.imei && <div><b>{t("imei")}</b>: {order.imei}</div>}
              <div><b>{t("problemDescription")}</b>: {order.problemDescription}</div>
              <div><b>{t("estimatedCost")}</b>: {order.estimatedCost} &#65020;</div>

              <div><b>{t("status")}</b>: {(() => {
                switch (order.status) {
                  case "Pending": return t("pending");
                  case "InProgress": return t("inProgress");
                  case "Ready": return t("ready");
                  case "Collected": return t("collected");
                  default: return order.status;
                }
              })()}</div>
              <div><b>{t("lastUpdatedAt") || "Last Updated At"}</b>: {new Date(order.lastUpdatedAt).toLocaleString()}</div>
              {order.status === "Collected" && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold">
                  {t("deviceReadyMessage")}
                </div>
              )}
              {order.status === "Ready" && (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center font-semibold">
                  {t("deviceReadyForPickup")}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackOrder; 