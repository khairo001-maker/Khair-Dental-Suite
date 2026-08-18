import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const schema = z.object({
  toothNumber: z.string().min(1),
  procedure: z.string().min(1),
  priority: z.enum(['Immediate', 'Short-term', 'Long-term', 'Elective']),
  status: z.enum(['Planned', 'In Progress', 'Completed', 'Cancelled']),
  estimatedSessions: z.coerce.number().min(1),
  estimatedCost: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export default function TreatmentPlanTab({ patientId, t }: { patientId: string, t: (key: string) => string }) {
  const { treatmentPlanItems, addTreatmentPlanItem, updateTreatmentPlanItem, deleteTreatmentPlanItem } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const items = treatmentPlanItems.filter(i => i.patientId === patientId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      toothNumber: "",
      procedure: "",
      priority: "Short-term",
      status: "Planned",
      estimatedSessions: 1,
      estimatedCost: undefined,
      notes: "",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    addTreatmentPlanItem({
      patientId,
      ...data,
      notes: data.notes || "",
      completedSessions: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsOpen(false);
    form.reset();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Immediate': return 'bg-red-100 text-red-800 border-red-200';
      case 'Short-term': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Long-term': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              {t("treatment_plan.add")}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-6">
              <SheetTitle>{t("treatment_plan.add")}</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="toothNumber" render={({ field }) => (
                  <FormItem><FormLabel>{t("treatment_plan.tooth")} *</FormLabel><FormControl><Input placeholder="e.g. 16, Upper Arch" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="procedure" render={({ field }) => (
                  <FormItem><FormLabel>{t("treatment_plan.procedure")} *</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem><FormLabel>{t("treatment_plan.priority")} *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['Immediate', 'Short-term', 'Long-term', 'Elective'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem><FormLabel>Status *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['Planned', 'In Progress', 'Completed', 'Cancelled'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="estimatedSessions" render={({ field }) => (
                  <FormItem><FormLabel>Est. Sessions *</FormLabel><FormControl><Input type="number" min="1" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="estimatedCost" render={({ field }) => (
                  <FormItem><FormLabel>Estimated Cost</FormLabel><FormControl><Input type="number" min="0" step="0.01" {...field} value={field.value ?? ""} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <div className="pt-4"><Button type="submit" className="w-full min-h-[44px]">Save Item</Button></div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={ClipboardList} title={t("treatment_plan.empty")} description={t("treatment_plan.empty_subtext")} />
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("treatment_plan.tooth")}</th>
                  <th className="px-4 py-3 font-medium">{t("treatment_plan.procedure")}</th>
                  <th className="px-4 py-3 font-medium">{t("treatment_plan.priority")}</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sessions</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-muted/30 h-14 transition-colors">
                    <td className="px-4 py-2">
                      <span className="inline-flex h-7 px-2.5 items-center justify-center rounded-md border font-medium bg-muted/50">
                        {item.toothNumber}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium">{item.procedure}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline" className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                    </td>
                    <td className="px-4 py-2">
                      <Select 
                        value={item.status} 
                        onValueChange={(val: any) => updateTreatmentPlanItem(item.id, { status: val, updatedAt: new Date().toISOString() })}
                      >
                        <SelectTrigger className="h-8 w-[130px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {item.completedSessions} / {item.estimatedSessions}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteTreatmentPlanItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
