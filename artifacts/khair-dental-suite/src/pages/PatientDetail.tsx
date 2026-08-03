import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { useParams, Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/EmptyState";
import { 
  ClipboardList, Smile, ScanLine, Camera, CreditCard, ArrowLeft,
  FileText, Activity, HeartPulse, History, Calendar, Check, Stethoscope, Droplet, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Patient, Visit, TreatmentPlanItem, FinancialRecord, PatientDocument } from "@/types";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Sub-components for tabs
import MedicalHistoryTab from "./PatientTabs/MedicalHistoryTab";
import DentalHistoryTab from "./PatientTabs/DentalHistoryTab";
import VisitsTab from "./PatientTabs/VisitsTab";
import TreatmentPlanTab from "./PatientTabs/TreatmentPlanTab";
import FinancialTab from "./PatientTabs/FinancialTab";
import DocumentsTab from "./PatientTabs/DocumentsTab";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, isRTL } = useLanguage();
  const { patients, updatePatient } = useDataStore();
  
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <Layout>
        <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-[50vh]">
          <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Patient not found</h2>
          <Link href="/patients">
            <Button>Back to Patients</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const age = patient.dob ? Math.floor((new Date().getTime() - new Date(patient.dob).getTime()) / 3.15576e+10) : '--';
  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
  const allergyCount = patient.medicalHistory?.allergies?.length || 0;
  const diseaseCount = patient.medicalHistory?.systemicDiseases?.length || 0;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <Link href="/patients">
          <Button variant="ghost" className="pl-0 hover:bg-transparent -ml-2 text-muted-foreground mb-2">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
            Back to Patients
          </Button>
        </Link>
        
        {/* Header Card */}
        <header className="bg-card border rounded-xl p-6 shadow-sm flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold shrink-0">
              {getInitials(patient.fullName)}
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{patient.fullName}</h1>
                <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className={patient.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' : ''}>
                  {patient.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> ID: {patient.nationalId || '--'}</span>
                <span>•</span>
                <span>Age: {age}</span>
                <span>•</span>
                <span>{patient.gender}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>{patient.phone}</span>
                {patient.email && (
                  <>
                    <span>•</span>
                    <span>{patient.email}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex flex-wrap lg:flex-col gap-2 shrink-0 self-start sm:self-auto">
              {patient.bloodType && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 py-1 text-sm font-medium">
                  <Droplet className="h-3.5 w-3.5" /> Blood: {patient.bloodType}
                </Badge>
              )}
              {allergyCount > 0 && (
                <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200 gap-1.5 py-1 text-sm font-medium">
                  <Activity className="h-3.5 w-3.5" /> {allergyCount} Allergies
                </Badge>
              )}
              {diseaseCount > 0 && (
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 gap-1.5 py-1 text-sm font-medium">
                  <HeartPulse className="h-3.5 w-3.5" /> {diseaseCount} Conditions
                </Badge>
              )}
            </div>
          </div>
          <div className="shrink-0">
             {/* Edit Patient action could go here in a full implementation */}
          </div>
        </header>

        {/* Main Content Tabs */}
        <Tabs defaultValue="personal" className="w-full">
          <div className="overflow-x-auto pb-2 -mb-2">
            <TabsList className="w-auto inline-flex h-auto p-1 bg-muted/50 rounded-lg whitespace-nowrap">
              <TabsTrigger value="personal" className="min-h-[44px] px-6">{t("patient.personal_info")}</TabsTrigger>
              <TabsTrigger value="medical" className="min-h-[44px] px-6">{t("patient.medical_history")}</TabsTrigger>
              <TabsTrigger value="dental" className="min-h-[44px] px-6">{t("patient.dental_history")}</TabsTrigger>
              <TabsTrigger value="visits" className="min-h-[44px] px-6">{t("patient.visits")}</TabsTrigger>
              <TabsTrigger value="photos" className="min-h-[44px] px-6">{t("patient.photos")}</TabsTrigger>
              <TabsTrigger value="radiology" className="min-h-[44px] px-6">{t("patient.radiology")}</TabsTrigger>
              <TabsTrigger value="treatment" className="min-h-[44px] px-6">{t("patient.treatment_plan")}</TabsTrigger>
              <TabsTrigger value="financial" className="min-h-[44px] px-6">{t("patient.financial")}</TabsTrigger>
              <TabsTrigger value="documents" className="min-h-[44px] px-6">{t("patient.documents")}</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6 pb-24">
            
            {/* Tab 1: Personal Info */}
            <TabsContent value="personal" className="space-y-6 focus-visible:outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4 text-sm">
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Full Name</dt><dd className="font-medium text-right">{patient.fullName}</dd></div>
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Date of Birth</dt><dd className="font-medium text-right">{patient.dob} (Age: {age})</dd></div>
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Gender</dt><dd className="font-medium text-right">{patient.gender}</dd></div>
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">National ID</dt><dd className="font-medium text-right">{patient.nationalId || '--'}</dd></div>
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Occupation</dt><dd className="font-medium text-right">{patient.occupation || '--'}</dd></div>
                      <div className="flex justify-between pb-2"><dt className="text-muted-foreground">Blood Type</dt><dd className="font-medium text-right">{patient.bloodType || '--'}</dd></div>
                    </dl>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact & Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-4 text-sm">
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Phone</dt><dd className="font-medium text-right">{patient.phone}</dd></div>
                      <div className="flex justify-between border-b pb-2"><dt className="text-muted-foreground">Email</dt><dd className="font-medium text-right">{patient.email || '--'}</dd></div>
                      <div className="flex flex-col border-b pb-2 space-y-1"><dt className="text-muted-foreground">Address</dt><dd className="font-medium whitespace-pre-wrap">{patient.address || '--'}</dd></div>
                    </dl>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">{t("patient.emergency_contact")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Contact Name</div>
                        <div className="font-medium">{patient.emergencyContact?.name || '--'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Relationship</div>
                        <div className="font-medium">{patient.emergencyContact?.relationship || '--'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Phone</div>
                        <div className="font-medium">{patient.emergencyContact?.phone || '--'}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab 2: Medical History */}
            <TabsContent value="medical" className="focus-visible:outline-none">
              <MedicalHistoryTab patient={patient} updatePatient={updatePatient} t={t} />
            </TabsContent>

            {/* Tab 3: Dental History */}
            <TabsContent value="dental" className="focus-visible:outline-none">
              <DentalHistoryTab patient={patient} updatePatient={updatePatient} t={t} />
            </TabsContent>

            {/* Tab 4: Visits */}
            <TabsContent value="visits" className="focus-visible:outline-none">
              <VisitsTab patientId={patient.id} t={t} />
            </TabsContent>

            {/* Tab 5: Photos */}
            <TabsContent value="photos" className="focus-visible:outline-none">
              <div className="flex justify-end mb-4">
                <Button className="min-h-[44px]"><Camera className="h-4 w-4 mr-2" /> Add Photo</Button>
              </div>
              <EmptyState icon={Camera} title={t("photos.empty")} description={t("photos.empty_subtext")} />
            </TabsContent>

            {/* Tab 6: Radiographs */}
            <TabsContent value="radiology" className="focus-visible:outline-none">
              <div className="flex justify-end mb-4">
                <Button className="min-h-[44px]"><ScanLine className="h-4 w-4 mr-2" /> Add Radiograph</Button>
              </div>
              <EmptyState icon={ScanLine} title={t("radiology.empty")} description={t("radiology.empty_subtext")} />
            </TabsContent>

            {/* Tab 7: Treatment Plan */}
            <TabsContent value="treatment" className="focus-visible:outline-none">
              <TreatmentPlanTab patientId={patient.id} t={t} />
            </TabsContent>

            {/* Tab 8: Financial */}
            <TabsContent value="financial" className="focus-visible:outline-none">
              <FinancialTab patientId={patient.id} t={t} />
            </TabsContent>

            {/* Tab 9: Documents */}
            <TabsContent value="documents" className="focus-visible:outline-none">
              <DocumentsTab patientId={patient.id} t={t} />
            </TabsContent>

          </div>
        </Tabs>
      </div>
    </Layout>
  );
}
