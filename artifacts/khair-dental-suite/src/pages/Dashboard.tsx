import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { Users, ClipboardList, ScanLine, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Dashboard() {
  const { t } = useLanguage();
  const { patients, clinicalCases, radiologyEntries } = useDataStore();

  const openCasesCount = clinicalCases.filter(c => c.status !== 'Closed').length;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("nav.dashboard")}</h1>
            <p className="text-muted-foreground mt-1">Welcome to Khair Dental Suite</p>
          </div>
          <div className="flex gap-3">
            <Link href="/patients">
              <Button className="min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                {t("action.new_patient")}
              </Button>
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Calendar} title={t("dashboard.today_appointments")} value="--" color="bg-blue-100 text-blue-700" />
          <StatCard icon={Users} title={t("dashboard.total_patients")} value={patients.length.toString()} color="bg-green-100 text-green-700" />
          <StatCard icon={ClipboardList} title={t("dashboard.open_cases")} value={openCasesCount.toString()} color="bg-amber-100 text-amber-700" />
          <StatCard icon={ScanLine} title={t("dashboard.pending_xrays")} value={radiologyEntries.length.toString()} color="bg-purple-100 text-purple-700" />
        </div>

        {patients.length === 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
              <Users className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold">{t("dashboard.get_started")}</h2>
            <p className="text-muted-foreground max-w-md mx-auto">{t("dashboard.add_first_patient")}</p>
            <Link href="/patients">
              <Button size="lg" className="min-h-[44px]">
                {t("action.new_patient")}
              </Button>
            </Link>
          </div>
        )}

        <div className="bg-card border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">{t("dashboard.recent_activity")}</h2>
          <div className="text-center py-8 text-muted-foreground">
            {t("common.no_data")}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon: Icon, title, value, color }: { icon: any, title: string, value: string, color: string }) {
  return (
    <div className="bg-card border rounded-xl p-6 flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
}
