import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { CreditCard, Plus, Trash2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

const schema = z.object({
  date: z.string().min(1),
  description: z.string().min(1),
  procedure: z.string().optional(),
  toothNumber: z.string().optional(),
  fee: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  amountPaid: z.coerce.number().min(0),
  paymentMethod: z.enum(['Cash', 'Card', 'Insurance', 'Bank Transfer', 'Other']),
  status: z.enum(['Pending', 'Partial', 'Paid', 'Overdue', 'Waived']),
  notes: z.string().optional(),
});

export default function FinancialTab({ patientId, t }: { patientId: string, t: (key: string) => string }) {
  const { financialRecords, addFinancialRecord, deleteFinancialRecord } = useDataStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const records = financialRecords.filter(r => r.patientId === patientId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Real-time computed totals from actual records only (as requested)
  const totalBilled = records.reduce((sum, r) => sum + r.fee, 0);
  const totalPaid = records.reduce((sum, r) => sum + r.amountPaid, 0);
  const totalDiscount = records.reduce((sum, r) => sum + r.discount, 0);
  const balance = totalBilled - totalDiscount - totalPaid;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      procedure: "",
      toothNumber: "",
      fee: 0,
      discount: 0,
      amountPaid: 0,
      paymentMethod: "Cash",
      status: "Pending",
      notes: "",
    }
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    addFinancialRecord({
      patientId,
      ...data,
      procedure: data.procedure || "",
      toothNumber: data.toothNumber || "",
      notes: data.notes || "",
    });
    setIsOpen(false);
    form.reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Partial': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Overdue': return 'bg-red-100 text-red-800 border-red-200';
      case 'Waived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return '';
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">{t("financial.total_billed")}</div>
            <div className="text-3xl font-bold">{formatCurrency(totalBilled)}</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30">
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">{t("financial.total_paid")}</div>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
          </CardContent>
        </Card>
        <Card className={balance > 0 ? "bg-red-50/50 border-red-100" : "bg-muted/30"}>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground mb-1">{t("financial.balance")}</div>
            <div className={`text-3xl font-bold ${balance > 0 ? 'text-red-600' : ''}`}>{formatCurrency(balance)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center pt-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button className="min-h-[44px]">
              <Plus className="h-4 w-4 mr-2" />
              {t("financial.add")}
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto sm:max-w-md">
            <SheetHeader className="mb-6">
              <SheetTitle>{t("financial.add")}</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="date" render={({ field }) => (
                  <FormItem><FormLabel>Date *</FormLabel><FormControl><Input type="date" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description *</FormLabel><FormControl><Input placeholder="e.g. Consultation fee" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fee" render={({ field }) => (
                    <FormItem><FormLabel>Fee *</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="discount" render={({ field }) => (
                    <FormItem><FormLabel>Discount</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="amountPaid" render={({ field }) => (
                    <FormItem><FormLabel>Amount Paid *</FormLabel><FormControl><Input type="number" step="0.01" {...field} className="min-h-[48px]" /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                    <FormItem><FormLabel>Payment Method *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {['Cash', 'Card', 'Insurance', 'Bank Transfer', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem><FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="min-h-[48px]"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {['Pending', 'Partial', 'Paid', 'Overdue', 'Waived'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                  <FormItem><FormLabel>Notes</FormLabel><FormControl><Input {...field} className="min-h-[48px]" /></FormControl></FormItem>
                )} />
                <div className="pt-4"><Button type="submit" className="w-full min-h-[44px]">Save Record</Button></div>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      {records.length === 0 ? (
        <EmptyState icon={CreditCard} title={t("financial.empty")} description={t("financial.empty_subtext")} />
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium text-right">Fee</th>
                  <th className="px-4 py-3 font-medium text-right">Discount</th>
                  <th className="px-4 py-3 font-medium text-right">Paid</th>
                  <th className="px-4 py-3 font-medium">Method</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-muted/30 h-14 transition-colors">
                    <td className="px-4 py-2 font-medium">{r.date}</td>
                    <td className="px-4 py-2">{r.description}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(r.fee)}</td>
                    <td className="px-4 py-2 text-right text-muted-foreground">{r.discount > 0 ? formatCurrency(r.discount) : '-'}</td>
                    <td className="px-4 py-2 text-right font-medium text-green-600">{r.amountPaid > 0 ? formatCurrency(r.amountPaid) : '-'}</td>
                    <td className="px-4 py-2"><Badge variant="outline">{r.paymentMethod}</Badge></td>
                    <td className="px-4 py-2"><Badge variant="outline" className={getStatusColor(r.status)}>{r.status}</Badge></td>
                    <td className="px-4 py-2 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteFinancialRecord(r.id)}>
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
