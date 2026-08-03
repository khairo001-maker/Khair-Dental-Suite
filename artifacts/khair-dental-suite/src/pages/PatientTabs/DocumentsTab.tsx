import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { FileText, Plus, Download, Trash2, UploadCloud } from "lucide-react";
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
  name: z.string().min(1),
  category: z.enum(['Consent Form', 'Referral', 'Lab Result', 'Insurance', 'Prescription', 'Other']),
  date: z.string().min(1),
  notes: z.string().optional(),
});

export default function DocumentsTab({ patientId, t }: { patientId: string, t: (key: string) => string }) {
  const { patientDocuments, addPatientDocument, deletePatientDocument } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const docs = patientDocuments.filter(d => d.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: "Consent Form",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    addPatientDocument({
      patientId,
      ...data,
      notes: data.notes || "",
    });
    setIsOpen(false);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              {t("documents.add")}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-6">
              <SheetTitle>{t("documents.add")}</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Document Name *</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem><FormLabel>{t("documents.category")} *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['Consent Form', 'Referral', 'Lab Result', 'Insurance', 'Prescription', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date *</FormLabel><FormControl><Input type="date" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                
                <div className="mt-4 border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center bg-muted/20 text-muted-foreground">
                  <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm font-medium">Tap to select file</p>
                  <p className="text-xs">PDF, JPG, PNG (Max 5MB)</p>
                </div>

                <div className="pt-4"><Button type="submit" className="w-full min-h-[44px]">Upload Document</Button></div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {docs.length === 0 ? (
        <EmptyState icon={FileText} title={t("documents.empty")} description={t("documents.empty_subtext")} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map(doc => (
            <div key={doc.id} className="bg-card border rounded-lg p-4 flex flex-col h-full hover:shadow-sm transition-shadow group">
              <div className="flex items-start gap-3 flex-1">
                <div className="bg-primary/10 text-primary p-2.5 rounded-md shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate" title={doc.name}>{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <Badge variant="secondary" className="text-xs">{doc.category}</Badge>
                    <span className="text-xs text-muted-foreground">{doc.date}</span>
                  </div>
                  {doc.notes && <p className="text-xs text-muted-foreground line-clamp-2">{doc.notes}</p>}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8" title="Download">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deletePatientDocument(doc.id)} title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
