import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { RepairRequestForm } from "@/components/RepairRequestForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ListFilter, Smartphone, LayoutGrid, User, Wrench } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";

const SUPPORT_WHATSAPP = "https://wa.me/967717656259"; // Replace with actual number
const SUPPORT_EMAIL = "ht93297@gmail.com"; // Replace with actual email

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-0 md:p-0">
      <Navbar showHome={false} showOrders={true} showLogout={true} showStatistics={true} />
      <main className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 items-start">
        <section className="flex-1 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 flex flex-col items-center text-center">
            <Smartphone size={48} className="text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{t("newRepairOrder")}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
              {t("homeIntro", { defaultValue: "Easily create a new repair order for your customer. Fill in the details below and submit the request." })}
            </p>
            <RepairRequestForm />
          </div>
        </section>
        <aside className="w-full md:w-80 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center">
            <User size={32} className="text-blue-400 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{t("viewAllOrders")}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm text-center">
              {t("homeOrdersHint", { defaultValue: "See all repair orders, track their status, and manage your workflow." })}
            </p>
            <Link to="/orders" className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold flex items-center gap-2 justify-center">
                <ListFilter size={18} />
                {t("viewAllOrders")}
              </Button>
            </Link>
          </div>
          {/* Statistics Navigation Card */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 flex flex-col items-center mt-2">
            <Wrench size={32} className="text-purple-500 mb-2" />
            <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-gray-100">{t("Statistics")}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm text-center">
              {t("statisticsDescription", { defaultValue: "View detailed statistics and analytics for your repair orders." })}
            </p>
            <Link to="/statistics" className="w-full">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800 text-white font-bold flex items-center gap-2 justify-center">
                <LayoutGrid size={18} />
                {t("goToStatistics")}
              </Button>
            </Link>
          </div>
        </aside>
      </main>
      {/* Floating Contact Support Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white w-14 h-14 flex items-center justify-center"
            size="icon"
            aria-label="Contact Support"
          >
            <MessageCircle size={28} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("contactSupport", { defaultValue: "Contact Support" })}</DialogTitle>
            <DialogDescription>
              {t("contactSupportDescription", { defaultValue: "Reach us via WhatsApp or Email for support." })}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <a
              href={SUPPORT_WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold flex items-center gap-2 justify-center">
                <MessageCircle size={20} /> {t("contactViaWhatsApp", { defaultValue: "WhatsApp" })}
              </Button>
            </a>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="w-full">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold flex items-center gap-2 justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.876 1.797l-7.5 5.625a2.25 2.25 0 01-2.748 0l-7.5-5.625A2.25 2.25 0 012.25 6.993V6.75" /></svg>
                {t("contactViaEmail", { defaultValue: "Email" })}
              </Button>
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
