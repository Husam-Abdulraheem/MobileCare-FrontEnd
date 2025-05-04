import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { BarChart2, ClipboardList, ChartNoAxesCombined } from "lucide-react";

const Statistics = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<{ orderCount: number; avgCost: number } | null>(null);
  const [total, setTotal] = useState<{ totalRevenue: number } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let uid = 1;
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        uid = payload.sub ? Number(payload.sub) : 1;
      } catch {
        uid = 1;
      }
    }
    axios
      .get(`https://localhost:7042/api/RepairOrders/user-stats/${uid}`)
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(t("errorFetchStatistics") || "Error fetching statistics");
        setLoading(false);
      });
      axios
      .get(`https://localhost:7042/api/RepairOrders/user-revenue/${uid}`)
      .then((res) => {
        setTotal(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError(t("errorFetchStatistics") || "Error fetching statistics");
        setLoading(false);
      });
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <Navbar showHome={true} showOrders={true} showLogout={true} showStatistics={false} />
      <main className="max-w-3xl mx-auto px-4 py-12 flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-blue-900 dark:text-blue-200 animate-fade-in">
          {t("yourStatistics") || "Your Statistics"}
        </h1>
        <p className="text-center text-muted-foreground mb-6">
          {t("statisticsDescription") || "A summary of your repair activity and costs."}
        </p>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            <span className="ml-4 text-lg">{t("loading") || "Loading..."}</span>
          </div>
        ) : error ? (
          <Card className="shadow-lg border-red-200 bg-red-50 dark:bg-red-900/30 animate-fade-in">
            <CardContent className="text-red-600 py-8 text-center font-semibold">{error}</CardContent>
          </Card>
        ) : stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <Card className="shadow-xl border-blue-200 bg-white/80 dark:bg-blue-950/60 hover:scale-[1.03] transition-transform">
              <CardHeader className="flex flex-row items-center gap-3">
                <ClipboardList className="text-blue-600 dark:text-blue-300 w-8 h-8" />
                <CardTitle className="text-lg">{t("totalOrders") || "Total Orders"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 transition-all duration-500">
                  {stats.orderCount}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-blue-200 bg-white/80 dark:bg-blue-950/60 hover:scale-[1.03] transition-transform">
              <CardHeader className="flex flex-row items-center gap-3">
                <BarChart2 className="text-blue-600 dark:text-blue-300 w-8 h-8" />
                <CardTitle className="text-lg">{t("averageRepairCost") || "Average Repair Cost"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 transition-all duration-500">
                  {stats?.avgCost?.toLocaleString(undefined, { maximumFractionDigits: 2 })} $
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-xl border-blue-200 bg-white/80 dark:bg-blue-950/60 hover:scale-[1.03] transition-transform">
              <CardHeader className="flex flex-row items-center gap-3">
                <ChartNoAxesCombined className="text-blue-600 dark:text-blue-300 w-8 h-8" />
                <CardTitle className="text-lg">{t("totalRepairCost") || "Total Repair Cost"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-extrabold text-blue-700 dark:text-blue-200 transition-all duration-500">
                  {total?.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 2 })} $
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Statistics;
