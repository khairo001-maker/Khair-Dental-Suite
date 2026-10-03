import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { PatientSelector } from "@/components/PatientSelector";
import { RadiologyGallery } from "@/components/RadiologyGallery";
import { ScanLine } from "lucide-react";

export default function Radiology() {
  const { t } = useLanguage();
  const { patients } = useDataStore();
  const [patientId, setPatientId] = useState("");
  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center bg-card border rounded-xl p-4">
          <div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-primary/10 text-primary"><ScanLine className="h-5 w-5" /></div><div><h1 className="text-2xl font-bold">{t("nav.radiology")}</h1><p className="text-sm text-muted-foreground">{t("radiology.local_page_subtitle")}</p></div></div>
          <div className="w-full sm:w-80"><PatientSelector value={patientId} onValueChange={setPatientId} /></div>
        </header>
        {patientId ? <RadiologyGallery patientId={patientId} /> : <div className="border border-dashed rounded-xl py-16 text-center text-muted-foreground">{patients.length ? t("radiology.select_patient") : t("radiology.no_patients")}</div>}
      </div>
    </Layout>
  );
}