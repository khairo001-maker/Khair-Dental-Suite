import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Users, Plus, Search, ChevronRight, Activity, Calendar, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Patient } from "@/types";

const patientFormSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email().or(z.literal("")),
  address: z.string().optional(),
  occupation: z.string().optional(),
  nationalId: z.string().optional(),
  bloodType: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  medicalHistory: z.object({
    allergies: z.array(z.string()).default([]),
    medications: z.array(z.string()).default([]),
    systemicDiseases: z.array(z.string()).default([]),
    smoking: z.enum(["Never", "Former", "Current"]).default("Never"),
    pregnancy: z.enum(["Yes", "No", "N/A"]).default("N/A"),
    notes: z.string().default(""),
  }).optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

export default function Patients() {
  const { t, isRTL } = useLanguage();
  const { patients, addPatient } = useDataStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [isOpen, setIsOpen] = useState(false);
  
  const [emergencyOpen, setEmergencyOpen] = useState(true);
  const [medicalOpen, setMedicalOpen] = useState(false);

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      occupation: "",
      nationalId: "",
      bloodType: "",
      emergencyContact: { name: "", relationship: "", phone: "" },
      medicalHistory: {
        allergies: [],
        medications: [],
        systemicDiseases: [],
        smoking: "Never",
        pregnancy: "N/A",
        notes: "",
      }
    },
  });

  const [tempAllergy, setTempAllergy] = useState("");
  const [tempMed, setTempMed] = useState("");
  const [tempDisease, setTempDisease] = useState("");

  const filtered = patients.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase()) || 
                          p.phone.includes(search) ||
                          (p.nationalId && p.nationalId.includes(search));
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const onSubmit = (data: PatientFormValues) => {
    addPatient({
      fullName: data.fullName,
      dob: data.dob,
      gender: data.gender,
      phone: data.phone,
      email: data.email || "",
      address: data.address || "",
      occupation: data.occupation || "",
      nationalId: data.nationalId || "",
      bloodType: data.bloodType || "",
      insuranceProvider: "",
      insuranceNumber: "",
      emergencyContact: {
        name: data.emergencyContact?.name || "",
        phone: data.emergencyContact?.phone || "",
        relationship: data.emergencyContact?.relationship || "",
      },
      medicalHistory: {
        allergies: data.medicalHistory?.allergies || [],
        medications: data.medicalHistory?.medications || [],
        systemicDiseases: data.medicalHistory?.systemicDiseases || [],
        smoking: data.medicalHistory?.smoking || "Never",
        pregnancy: data.medicalHistory?.pregnancy || "N/A",
        notes: data.medicalHistory?.notes || "",
      },
      dentalHistory: {
        lastDentalVisit: "",
        previousDentist: "",
        chiefComplaint: "",
        dentalAnxiety: "None",
        previousTreatments: "",
        notes: "",
      },
      status: 'Active',
      registeredAt: new Date().toISOString(),
      lastVisit: '',
    });
    setIsOpen(false);
    form.reset();
  };

  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();

  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.status === "Active").length;
  const registeredThisMonth = patients.filter(p => {
    const regDate = new Date(p.registeredAt);
    const now = new Date();
    return regDate.getMonth() === now.getMonth() && regDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("nav.patients")}</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="min-h-[44px]" data-testid="button-new-patient">
                <Plus className="h-4 w-4 mr-2" />
                {t("action.new_patient")}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl">{t("action.new_patient")}</SheetTitle>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Section 1: Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">{t("patient.personal_info")}</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.full_name")} *</FormLabel>
                            <FormControl>
                              <Input {...field} className="min-h-[48px]" data-testid="input-fullname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="dob"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.dob")} *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} className="min-h-[48px]" data-testid="input-dob" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.gender")} *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="min-h-[48px]" data-testid="select-gender">
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.phone")} *</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} className="min-h-[48px]" data-testid="input-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.email")}</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} className="min-h-[48px]" data-testid="input-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.address")}</FormLabel>
                            <FormControl>
                              <Textarea rows={2} {...field} className="min-h-[48px]" data-testid="input-address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.occupation")}</FormLabel>
                              <FormControl>
                                <Input {...field} className="min-h-[48px]" data-testid="input-occupation" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nationalId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.national_id")}</FormLabel>
                              <FormControl>
                                <Input {...field} className="min-h-[48px]" data-testid="input-nationalid" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bloodType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.blood_type")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="min-h-[48px]" data-testid="select-blood">
                                    <SelectValue placeholder="-" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="A+">A+</SelectItem>
                                  <SelectItem value="A-">A-</SelectItem>
                                  <SelectItem value="B+">B+</SelectItem>
                                  <SelectItem value="B-">B-</SelectItem>
                                  <SelectItem value="AB+">AB+</SelectItem>
                                  <SelectItem value="AB-">AB-</SelectItem>
                                  <SelectItem value="O+">O+</SelectItem>
                                  <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Emergency Contact */}
                  <Collapsible open={emergencyOpen} onOpenChange={setEmergencyOpen} className="border rounded-md p-4">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer" data-testid="trigger-emergency">
                        <h3 className="font-semibold">{t("patient.emergency_contact")}</h3>
                        <ChevronRight className={`h-5 w-5 transition-transform ${emergencyOpen ? 'rotate-90' : ''}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="emergencyContact.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.emergency_name")}</FormLabel>
                              <FormControl>
                                <Input {...field} className="min-h-[48px]" data-testid="input-em-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContact.relationship"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.emergency_relationship")}</FormLabel>
                              <FormControl>
                                <Input {...field} className="min-h-[48px]" data-testid="input-em-rel" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="emergencyContact.phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("form.emergency_phone")}</FormLabel>
                              <FormControl>
                                <Input type="tel" {...field} className="min-h-[48px]" data-testid="input-em-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Section 3: Medical History */}
                  <Collapsible open={medicalOpen} onOpenChange={setMedicalOpen} className="border rounded-md p-4">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between cursor-pointer" data-testid="trigger-medical">
                        <h3 className="font-semibold">{t("patient.medical_history")}</h3>
                        <ChevronRight className={`h-5 w-5 transition-transform ${medicalOpen ? 'rotate-90' : ''}`} />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-4 pt-4">
                      
                      <FormField
                        control={form.control}
                        name="medicalHistory.allergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("patient.allergies")}</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(field.value ?? []).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="px-2 py-1">
                                  {tag}
                                  <button type="button" onClick={() => field.onChange((field.value ?? []).filter((_, i) => i !== idx))} className="ml-1 text-muted-foreground hover:text-destructive">
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <FormControl>
                              <Input 
                                placeholder="Type and press Enter..."
                                value={tempAllergy}
                                onChange={(e) => setTempAllergy(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    if (tempAllergy.trim()) {
                                      field.onChange([...(field.value ?? []), tempAllergy.trim()]);
                                      setTempAllergy("");
                                    }
                                  }
                                }}
                                className="min-h-[48px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalHistory.medications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("patient.medications")}</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(field.value ?? []).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="px-2 py-1">
                                  {tag}
                                  <button type="button" onClick={() => field.onChange((field.value ?? []).filter((_, i) => i !== idx))} className="ml-1 text-muted-foreground hover:text-destructive">
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <FormControl>
                              <Input 
                                placeholder="Type and press Enter..."
                                value={tempMed}
                                onChange={(e) => setTempMed(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    if (tempMed.trim()) {
                                      field.onChange([...(field.value ?? []), tempMed.trim()]);
                                      setTempMed("");
                                    }
                                  }
                                }}
                                className="min-h-[48px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="medicalHistory.systemicDiseases"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("patient.systemic_diseases")}</FormLabel>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {(field.value ?? []).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="px-2 py-1">
                                  {tag}
                                  <button type="button" onClick={() => field.onChange((field.value ?? []).filter((_, i) => i !== idx))} className="ml-1 text-muted-foreground hover:text-destructive">
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <FormControl>
                              <Input 
                                placeholder="Type and press Enter..."
                                value={tempDisease}
                                onChange={(e) => setTempDisease(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ',') {
                                    e.preventDefault();
                                    if (tempDisease.trim()) {
                                      field.onChange([...(field.value ?? []), tempDisease.trim()]);
                                      setTempDisease("");
                                    }
                                  }
                                }}
                                className="min-h-[48px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="medicalHistory.smoking"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("patient.smoking")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="min-h-[48px]">
                                    <SelectValue placeholder="-" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Never">Never</SelectItem>
                                  <SelectItem value="Former">Former</SelectItem>
                                  <SelectItem value="Current">Current</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="medicalHistory.pregnancy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("patient.pregnancy")}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="min-h-[48px]">
                                    <SelectValue placeholder="-" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="N/A">N/A</SelectItem>
                                  <SelectItem value="No">No</SelectItem>
                                  <SelectItem value="Yes">Yes</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="medicalHistory.notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.notes")}</FormLabel>
                            <FormControl>
                              <Textarea rows={2} {...field} className="min-h-[48px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  <div className="pt-4 sticky bottom-0 bg-background py-4">
                    <Button type="submit" className="w-full min-h-[44px]" data-testid="button-save-patient">{t("form.save")}</Button>
                  </div>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
        </header>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("patients.total")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("patients.active")}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePatients}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{t("patients.registered_this_month")}</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registeredThisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar & List */}
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/10">
            <div className="relative w-full sm:max-w-md">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3.5 h-5 w-5 text-muted-foreground`} />
              <Input 
                placeholder={t("patients.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`min-h-[48px] ${isRTL ? 'pr-10' : 'pl-10'}`}
                data-testid="input-search-patients"
              />
            </div>
            <div className="flex bg-muted/50 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              {(["All", "Active", "Inactive"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 min-h-[40px] text-sm font-medium rounded-md whitespace-nowrap transition-colors flex-1 sm:flex-none
                    ${filterStatus === status ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-muted'}
                  `}
                >
                  {t(`patients.${status.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>
          
          {filtered.length === 0 ? (
            <EmptyState 
              icon={Users}
              title={t("patients.empty")}
              description={t("patients.empty_subtext")}
              actionLabel={t("action.new_patient")}
              onAction={() => setIsOpen(true)}
            />
          ) : (
            <div className="divide-y">
              {filtered.map(p => (
                <div key={p.id} className="flex flex-col sm:flex-row p-4 sm:items-center gap-4 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                      {getInitials(p.fullName)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{p.fullName}</h3>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {p.nationalId ? `ID: ${p.nationalId} • ` : ''} 
                        DOB: {p.dob} • {p.gender}
                      </div>
                      <div className="text-sm text-muted-foreground mt-0.5">
                        {p.phone} {p.email ? `• ${p.email}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64">
                    <Badge variant={p.status === 'Active' ? 'default' : 'secondary'} className={p.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' : ''}>
                      {t(`patients.${p.status.toLowerCase()}`)}
                    </Badge>
                    <Link href={`/patients/${p.id}`} className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors" data-testid={`link-view-patient-${p.id}`}>
                      {t("action.view_profile")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
