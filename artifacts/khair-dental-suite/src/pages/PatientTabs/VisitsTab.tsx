import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  dentist: z.string().min(1),
  type: z.enum(['Checkup', 'Emergency', 'Follow-up', 'Procedure', 'Consultation']),
  chiefComplaint: z.string().min(1),
  clinicalFindings: z.string().optional(),
  treatmentDone: z.string().optional(),
  nextVisitDate: z.string().optional(),
  nextVisitNotes: z.string().optional(),
});

export default function VisitsTab({ patientId, t }: { patientId: string, t: (key: string) => string }) {
  const { visits, addVisit } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  const patientVisits = visits.filter(v => v.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
      dentist: "",
      type: "Checkup",
      chiefComplaint: "",
      clinicalFindings: "",
      treatmentDone: "",
      nextVisitDate: "",
      nextVisitNotes: "",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    addVisit({
      patientId,
      ...data,
      clinicalFindings: data.clinicalFindings || "",
      treatmentDone: data.treatmentDone || "",
      nextVisitDate: data.nextVisitDate || "",
      nextVisitNotes: data.nextVisitNotes || "",
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Timeline</h3>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              {t("visits.record")}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-xl overflow-y-auto">
            <SheetHeader className="mb-6">
              <SheetTitle>{t("visits.record")}</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="date" render={({ field }) => (
                    <FormItem><FormLabel>{t("visits.date")} *</FormLabel><FormControl><Input type="date" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="time" render={({ field }) => (
                    <FormItem><FormLabel>{t("visits.time")} *</FormLabel><FormControl><Input type="time" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="dentist" render={({ field }) => (
                    <FormItem><FormLabel>{t("visits.dentist")} *</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>{t("visits.type")} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['Checkup', 'Emergency', 'Follow-up', 'Procedure', 'Consultation'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="chiefComplaint" render={({ field }) => (
                  <FormItem><FormLabel>Chief Complaint *</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="clinicalFindings" render={({ field }) => (
                  <FormItem><FormLabel>{t("visits.findings")}</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="treatmentDone" render={({ field }) => (
                  <FormItem><FormLabel>{t("visits.treatment_done")}</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <FormField control={form.control} name="nextVisitDate" render={({ field }) => (
                    <FormItem><FormLabel>Next Visit Date</FormLabel><FormControl><Input type="date" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="nextVisitNotes" render={({ field }) => (
                    <FormItem><FormLabel>Next Visit Notes</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                </div>
                <div className="pt-4"><Button type="submit" className="w-full min-h-[44px]">Save Visit</Button></div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {patientVisits.length === 0 ? (
        <EmptyState icon={Calendar} title={t("visits.empty")} description={t("visits.empty_subtext")} />
      ) : (
        <div className="relative pl-6 border-l-2 border-muted space-y-8 py-4">
          {patientVisits.map(v => (
            <div key={v.id} className="relative">
              <div className="absolute -left-[33px] top-1 h-4 w-4 rounded-full bg-background border-2 border-primary" />
              <div className="bg-card border rounded-lg p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg">{v.date}</span>
                    <span className="text-muted-foreground">{v.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{v.type}</Badge>
                    <span className="text-sm font-medium text-muted-foreground">Dr. {v.dentist}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">CHIEF COMPLAINT</div>
                    <div className="text-sm">{v.chiefComplaint}</div>
                  </div>
                  
                  {v.clinicalFindings && (
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">CLINICAL FINDINGS</div>
                      <div className="text-sm whitespace-pre-wrap bg-muted/20 p-3 rounded-md border border-muted/50">{v.clinicalFindings}</div>
                    </div>
                  )}
                  
                  {v.treatmentDone && (
                    <div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">TREATMENT DONE</div>
                      <div className="text-sm whitespace-pre-wrap">{v.treatmentDone}</div>
                    </div>
                  )}

                  {(v.nextVisitDate || v.nextVisitNotes) && (
                    <div className="mt-4 pt-4 border-t flex items-start gap-4">
                      <div className="bg-primary/5 text-primary p-2 rounded-md">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Next Visit: {v.nextVisitDate || 'TBD'}</div>
                        {v.nextVisitNotes && <div className="text-sm text-muted-foreground mt-1">{v.nextVisitNotes}</div>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
