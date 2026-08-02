import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Endodontics() {
  const { t } = useLanguage();
  const { endoCases } = useDataStore();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("nav.endodontics")}</h1>
          <Button className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            New Endo Case
          </Button>
        </header>

        {endoCases.length === 0 ? (
          <EmptyState 
            icon={Zap} 
            title={t("endo.empty")} 
            description={t("endo.empty_subtext")}
            actionLabel="New Endo Case"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          </div>
        )}
      </div>
    </Layout>
  );
}
