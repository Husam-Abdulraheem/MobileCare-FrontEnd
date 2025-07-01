
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { BarChart2, ClipboardList, ChartNoAxesCombined, Clock, Loader2, CheckCircle2, PackageCheck } from "lucide-react";

const Statistics = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<{ orderCount: number; avgCost: number } | null>(null);
  const [total, setTotal] = useState<{ totalRevenue: number } | null>(null);
  const [orderStatusCounts, setOrderStatusCounts] = useState<Array<{ status: string; totalOrders: number }>>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    // Get userId from localStorage (robust, works after reload)
    let userId = null;
    try {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        userId = userObj.uid;
      }
    } catch {}
    if (!userId) {
      setError(t("errorNotLoggedIn") || "Not logged in");
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "repairOrders"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const orders = querySnapshot.docs.map(doc => doc.data());
        // Total orders and average cost
        const orderCount = orders.length;
        const totalCost = orders.reduce((sum, o) => sum + (Number(o.estimatedCost) || 0), 0);
        const avgCost = orderCount > 0 ? totalCost / orderCount : 0;
        setStats({ orderCount, avgCost });
        setTotal({ totalRevenue: totalCost });
        // Count by status
        const statusMap: Record<string, number> = {};
        orders.forEach(o => {
          const status = o.status || "Pending";
          statusMap[status] = (statusMap[status] || 0) + 1;
        });
        setOrderStatusCounts(Object.entries(statusMap).map(([status, totalOrders]) => ({ status, totalOrders })));
        setLoading(false);
      } catch (err) {
        setError(t("errorFetchStatistics") || "Error fetching statistics");
        setLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 dark:from-gray-900 dark:to-blue-950">
      <Navbar showHome showOrders showLogout showStatistics={false} />
      <main className="max-w-5xl mx-auto px-2 md:px-8 py-10 flex flex-col gap-10">
        <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 animate-fade-in">
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 dark:text-blue-200 mb-2">{t("yourStatistics")}</h1>
            <p className="text-muted-foreground text-lg">{t("statisticsDescription")}</p>
          </div>
        </section>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
            <span className="ml-4 text-lg">{t("loading")}</span>
          </div>
        ) : error ? (
          <Card className="shadow-lg border-red-200 bg-red-50 dark:bg-red-900/30 animate-fade-in">
            <CardContent className="text-red-600 py-8 text-center font-semibold">{error}</CardContent>
          </Card>
        ) : stats && (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              <Card className="shadow-xl border-blue-200 bg-white/90 dark:bg-blue-950/70 hover:scale-[1.03] transition-transform">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <ClipboardList className="text-blue-600 dark:text-blue-300 w-10 h-10" />
                  <div>
                    <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-200">{t("totalOrders")}</CardTitle>
                    <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-100 mt-1">{stats.orderCount}</div>
                  </div>
                </CardHeader>
              </Card>
              <Card className="shadow-xl border-blue-200 bg-white/90 dark:bg-blue-950/70 hover:scale-[1.03] transition-transform">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <BarChart2 className="text-blue-600 dark:text-blue-300 w-10 h-10" />
                  <div>
                    <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-200">{t("averageRepairCost")}</CardTitle>
                    <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-100 mt-1">{stats?.avgCost?.toLocaleString(undefined, { maximumFractionDigits: 2 })} $</div>
                  </div>
                </CardHeader>
              </Card>
              <Card className="shadow-xl border-blue-200 bg-white/90 dark:bg-blue-950/70 hover:scale-[1.03] transition-transform">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <ChartNoAxesCombined className="text-blue-600 dark:text-blue-300 w-10 h-10" />
                  <div>
                    <CardTitle className="text-lg font-bold text-blue-900 dark:text-blue-200">{t("totalRepairCost")}</CardTitle>
                    <div className="text-3xl font-extrabold text-blue-700 dark:text-blue-100 mt-1">{total?.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 2 })} $</div>
                  </div>
                </CardHeader>
              </Card>
            </section>
            {/* Order count by status */}
            {orderStatusCounts.length > 0 && (
              <section className="mt-12 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6 text-blue-900 dark:text-blue-200">{t('orderCountByStatus')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {orderStatusCounts.map((item) => {
                    let Icon = ClipboardList;
                    switch (item.status) {
                      case "Pending":
                        Icon = Clock;
                        break;
                      case "InProgress":
                        Icon = Loader2;
                        break;
                      case "Ready":
                        Icon = CheckCircle2;
                        break;
                      case "Collected":
                        Icon = PackageCheck;
                        break;
                      default:
                        Icon = ClipboardList;
                    }
                    return (
                      <Card
                        key={item.status}
                        className="shadow-xl border-blue-200 bg-white/90 dark:bg-blue-950/70 hover:scale-[1.03] transition-transform"
                      >
                        <CardHeader className="flex flex-col items-center gap-2 pb-2">
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 mb-2">
                            <Icon className="text-blue-600 dark:text-blue-300 w-7 h-7" />
                          </span>
                          <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-200 text-center">
                            {(() => {
                              switch (item.status) {
                                case "Pending": return t("pending") || item.status;
                                case "InProgress": return t("inProgress") || item.status;
                                case "Ready": return t("ready") || item.status;
                                case "Collected": return t("collected") || item.status;
                                default: return t(item.status.toLowerCase()) || item.status;
                              }
                            })()}
                          </CardTitle>
                          <div className="text-3xl font-extrabold text-blue-900 dark:text-blue-100 text-center mt-1">
                            {item.totalOrders}
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Statistics;
