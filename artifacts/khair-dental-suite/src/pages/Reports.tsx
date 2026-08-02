import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { BarChart3, FileText, Users, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const { t } = useLanguage();

  const handleGenerate = () => {
    alert(t("reports.empty"));
  };

  const reports = [
    { id: 1, title: "Patient Summary", icon: Users, desc: "Overview of patient demographics and status." },
    { id: 2, title: "Appointment History", icon: Calendar, desc: "Record of all past and upcoming appointments." },
    { id: 3, title: "Clinical Case Report", icon: FileText, desc: "Detailed breakdown of clinical cases by specialty." },
    { id: 4, title: "Treatment Statistics", icon: BarChart3, desc: "Analysis of treatments provided." },
    { id: 5, title: "Financial Summary", icon: DollarSign, desc: "Overview of revenue and outstanding balances." },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("nav.reports")}</h1>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map(r => (
            <div key={r.id} className="bg-card border rounded-xl p-6 flex flex-col items-start space-y-4">
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                <r.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
              </div>
              <Button className="w-full min-h-[44px]" onClick={handleGenerate}>
                {t("reports.generate")}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
