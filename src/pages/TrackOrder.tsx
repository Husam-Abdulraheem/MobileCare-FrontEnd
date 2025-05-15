import { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

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
      const res = await axios.get(`https://localhost:7042/api/Customer/track-order/${trackCode}`);
      setOrder(res.data);
    } catch (err: any) {
      setError(t("notFoundDescription") || "Order not found.");
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
          const res = await axios.get(`https://localhost:7042/api/Customer/track-order/${codeFromUrl}`);
          setOrder(res.data);
        } catch (err: any) {
          setError(t("notFoundDescription") || "Order not found.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [searchParams, t]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
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
            <div className="mt-6 space-y-2 border-t pt-4">
              <div><b>{t("customerName")}</b>: {order.customerName}</div>
              <div><b>{t("deviceBrand")}</b>: {order.brand}</div>
              <div><b>{t("deviceModel")}</b>: {order.model}</div>
              {order.imei && <div><b>{t("imei")}</b>: {order.imei}</div>}
              <div><b>{t("problemDescription")}</b>: {order.problemDescription}</div>
              <div><b>{t("status")}</b>: {order.status}</div>
              <div><b>{t("lastUpdatedAt") || "Last Updated At"}</b>: {new Date(order.lastUpdatedAt).toLocaleString()}</div>
              {order.status === "Collected" && (
                <div className="mt-4 p-3 bg-green-100 text-green-800 rounded text-center font-semibold">
                  {t("deviceReadyMessage")}
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