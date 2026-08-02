import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Photos() {
  const { t } = useLanguage();
  const { photoEntries } = useDataStore();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t("nav.photos")}</h1>
          <Button className="min-h-[44px]">
            <Plus className="h-4 w-4 mr-2" />
            Add Photo
          </Button>
        </header>

        {photoEntries.length === 0 ? (
          <EmptyState 
            icon={Camera} 
            title={t("photos.empty")} 
            description={t("photos.empty_subtext")}
            actionLabel="Add Photo"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          </div>
        )}
      </div>
    </Layout>
  );
}
