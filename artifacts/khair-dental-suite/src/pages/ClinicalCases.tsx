import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { ClipboardList, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClinicalCases() {
  const { t } = useLanguage();
  const { clinicalCases } = useDataStore();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("nav.clinical_cases")}</h1>
          <Button className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            {t("action.new_case")}
          </Button>
        </header>

        {clinicalCases.length === 0 ? (
          <EmptyState 
            icon={ClipboardList} 
            title={t("cases.empty")} 
            description={t("cases.empty_subtext")}
            actionLabel={t("action.new_case")}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Case cards will go here */}
          </div>
        )}
      </div>
    </Layout>
  );
}
