import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PatientSelector } from "@/components/PatientSelector";
import VisitsTab from "./PatientTabs/VisitsTab";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { Calendar } from "lucide-react";

export default function Visits() {
  const { t } = useLanguage();
  const { patients } = useDataStore();
  const [patientId, setPatientId] = useState("");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-5">
        <header className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Calendar className="h-5 w-5 text-primary" /></div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{t("nav.visits")}</h1>
              <p className="text-sm text-muted-foreground">{t("visits.workspace_subtitle")}</p>
            </div>
          </div>
          <div className="w-full sm:w-80">
            <PatientSelector value={patientId} onValueChange={setPatientId} placeholder={t("visits.select_patient")} />
          </div>
        </header>
        {!patientId ? (
          <div className="bg-card border border-dashed rounded-xl py-20 text-center text-muted-foreground">
            {patients.length === 0 ? t("visits.no_patients") : t("visits.select_patient")}
          </div>
        ) : <VisitsTab patientId={patientId} t={t} />}
      </div>
    </Layout>
  );
}