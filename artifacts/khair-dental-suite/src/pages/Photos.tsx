import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { useState } from "react";
import { PatientSelector } from "@/components/PatientSelector";
import { ClinicalPhotosGallery } from "@/components/ClinicalPhotosGallery";

export default function Photos() {
  const { t } = useLanguage();
  const { patients } = useDataStore();
  const [patientId, setPatientId] = useState("");

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("nav.photos")}</h1>
          <div className="w-full sm:w-80"><PatientSelector value={patientId} onValueChange={setPatientId} /></div>
        </header>
        {patientId ? <ClinicalPhotosGallery patientId={patientId} /> : <div className="rounded-xl border border-dashed p-16 text-center text-muted-foreground">{patients.length ? t("photos.select_patient") : t("photos.no_patients")}</div>}
      </div>
    </Layout>
  );
}
