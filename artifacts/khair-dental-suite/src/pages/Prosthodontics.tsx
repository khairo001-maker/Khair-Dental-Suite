import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Prosthodontics() {
  const { t } = useLanguage();
  const { prosthodonticCases } = useDataStore();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("nav.prosthodontics")}</h1>
          <Button className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            New Prosthodontic Case
          </Button>
        </header>

        {prosthodonticCases.length === 0 ? (
          <EmptyState 
            icon={Package} 
            title={t("prostho.empty")} 
            description={t("prostho.empty_subtext")}
            actionLabel="New Prosthodontic Case"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          </div>
        )}
      </div>
    </Layout>
  );
}
