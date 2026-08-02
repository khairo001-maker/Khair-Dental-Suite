import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { useParams, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { ClipboardList, Smile, ScanLine, Camera, CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const { patients } = useDataStore();
  
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <Layout>
        <div className="p-8 text-center text-muted-foreground">Patient not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <Link href="/patients">
          <Button variant="ghost" className="pl-0 hover:bg-transparent -ml-2 text-muted-foreground">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            Back to Patients
          </Button>
        </Link>
        
        <header className="bg-card border rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold shrink-0">
            {patient.fullName.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-bold">{patient.fullName}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <p>ID: {patient.nationalId || '--'}</p>
              <p>{patient.phone}</p>
              <p>{patient.email}</p>
              <p>DOB: {patient.dob}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            {patient.bloodType && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium text-center border border-red-200">
                Blood: {patient.bloodType}
              </span>
            )}
            {patient.allergies && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium text-center border border-amber-200">
                Allergy: {patient.allergies}
              </span>
            )}
          </div>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 rounded-lg overflow-x-auto flex-wrap">
            <TabsTrigger value="overview" className="min-h-[44px] px-6">{t("patient.overview")}</TabsTrigger>
            <TabsTrigger value="cases" className="min-h-[44px] px-6">{t("patient.clinical_cases")}</TabsTrigger>
            <TabsTrigger value="odontogram" className="min-h-[44px] px-6">{t("patient.odontogram")}</TabsTrigger>
            <TabsTrigger value="radiology" className="min-h-[44px] px-6">{t("patient.radiology")}</TabsTrigger>
            <TabsTrigger value="photos" className="min-h-[44px] px-6">{t("patient.photos")}</TabsTrigger>
            <TabsTrigger value="billing" className="min-h-[44px] px-6">{t("patient.billing")}</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-lg">Demographics</h3>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Gender</dt><dd className="font-medium">{patient.gender}</dd></div>
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Status</dt><dd className="font-medium">{patient.status}</dd></div>
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Last Visit</dt><dd className="font-medium">{patient.lastVisit}</dd></div>
                    <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Insurance</dt><dd className="font-medium">{patient.insuranceProvider || '--'}</dd></div>
                  </dl>
                </div>
                <div className="bg-card border rounded-xl p-6">
                  <h3 className="font-semibold mb-4 text-lg">Clinical Notes</h3>
                  <p className="text-sm whitespace-pre-wrap">{patient.notes || 'No notes available.'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cases">
              <EmptyState icon={ClipboardList} title={t("cases.empty")} description={t("cases.empty_subtext")} actionLabel={t("action.new_case")} />
            </TabsContent>
            <TabsContent value="odontogram">
              <EmptyState icon={Smile} title="No Odontogram Records" description="Chart this patient's teeth." actionLabel="Go to Odontogram" onAction={() => window.location.href='/odontogram'} />
            </TabsContent>
            <TabsContent value="radiology">
              <EmptyState icon={ScanLine} title={t("radiology.empty")} description={t("radiology.empty_subtext")} actionLabel="Add Radiograph" />
            </TabsContent>
            <TabsContent value="photos">
              <EmptyState icon={Camera} title={t("photos.empty")} description={t("photos.empty_subtext")} actionLabel="Add Photo" />
            </TabsContent>
            <TabsContent value="billing">
              <EmptyState icon={CreditCard} title="No Billing Records" description="Manage invoices and payments." actionLabel="Create Invoice" />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
