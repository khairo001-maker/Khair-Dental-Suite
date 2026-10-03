import { useMemo, useState } from "react";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { CreditCard, Plus, Trash2, Receipt, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Currency, PaymentMethod } from "@/types";

const currencies: Currency[] = ["EUR", "USD", "TRY", "SYP"];
const methods: PaymentMethod[] = ["Cash", "Card", "Bank Transfer", "Electronic Wallet", "Other"];

const money = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);

export default function FinancialTab({ patientId, t }: { patientId: string; t: (key: string) => string }) {
  const {
    payments, addPayment, deletePayment, treatmentPlanItems, visits,
  } = useDataStore();
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0], amount: "", currency: "USD" as Currency,
    paymentMethod: "Cash" as PaymentMethod, visitId: "", treatmentPlanItemId: "", notes: "",
  });

  const patientPayments = payments.filter(p => p.patientId === patientId && !p.deletedAt);
  const planItems = treatmentPlanItems.filter(i => i.patientId === patientId && !i.deletedAt && i.status !== "Cancelled");
  const currencyPlanItems = planItems.filter(item => (item.currency || "USD") === currency);
  const costs = currencyPlanItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
  const paymentsInCurrency = patientPayments.filter(p => p.currency === currency);
  const paid = paymentsInCurrency.reduce((sum, p) => sum + p.amount, 0);
  const balance = costs - paid;
  const credit = Math.max(0, paid - costs);
  const status = credit > 0 ? "Credit" : paid === 0 ? "Unpaid" : balance > 0 ? "Partially Paid" : "Paid in Full";

  const transactions = useMemo(() => {
    const treatmentEvents = currencyPlanItems.filter(i => (i.estimatedCost || 0) > 0).map(i => ({
      id: `treatment-${i.id}`, date: i.createdAt || i.updatedAt, type: "Treatment",
      description: i.procedure, amount: i.estimatedCost || 0, currency, notes: `Tooth ${i.toothNumber}`,
    }));
    const paymentEvents = paymentsInCurrency.map(p => ({
      id: p.id, date: p.date, type: "Payment", description: `${p.paymentMethod} payment`,
      amount: p.amount, currency: p.currency, notes: p.notes,
    }));
    return [...treatmentEvents, ...paymentEvents].sort((a, b) => b.date.localeCompare(a.date));
  }, [planItems, patientPayments, currency]);

  const submit = () => {
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return;
    addPayment({
      patientId, date: form.date, amount, currency: form.currency,
      paymentMethod: form.paymentMethod, visitId: form.visitId || undefined,
      treatmentPlanItemId: form.treatmentPlanItemId || undefined,
      notes: form.notes, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    });
    setOpen(false);
    setForm({ date: new Date().toISOString().split("T")[0], amount: "", currency, paymentMethod: "Cash", visitId: "", treatmentPlanItemId: "", notes: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
        <div>
          <h3 className="text-lg font-semibold">Financial Summary</h3>
          <p className="text-sm text-muted-foreground">Treatment costs come from the treatment plan. Payments are recorded separately.</p>
        </div>
        <div className="flex gap-2">
          <Select value={currency} onValueChange={v => setCurrency(v as Currency)}><SelectTrigger className="min-h-[44px] w-28"><SelectValue /></SelectTrigger><SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
          <Button className="min-h-[44px]" onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-2" /> Record Payment</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Treatment Cost</p><p className="text-2xl font-bold mt-1">{money(costs, currency)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Paid</p><p className="text-2xl font-bold text-green-600 mt-1">{money(paid, currency)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Remaining</p><p className={`text-2xl font-bold mt-1 ${balance > 0 ? "text-red-600" : ""}`}>{money(Math.max(0, balance), currency)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Credit</p><p className="text-2xl font-bold text-blue-600 mt-1">{money(credit, currency)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Status</p><Badge className="mt-2" variant={status === "Paid in Full" || status === "Credit" ? "default" : "outline"}>{status}</Badge></CardContent></Card>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader className="mb-6"><SheetTitle>Record Payment</SheetTitle></SheetHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Date *</Label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="min-h-[48px] mt-1" /></div>
              <div><Label>Amount *</Label><Input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="min-h-[48px] mt-1" /></div>
              <div><Label>Currency</Label><Select value={form.currency} onValueChange={v => setForm(f => ({ ...f, currency: v as Currency }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{currencies.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Payment Method</Label><Select value={form.paymentMethod} onValueChange={v => setForm(f => ({ ...f, paymentMethod: v as PaymentMethod }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent>{methods.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div><Label>Visit ID (optional)</Label><Select value={form.visitId || "none"} onValueChange={v => setForm(f => ({ ...f, visitId: v === "none" ? "" : v }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Not linked</SelectItem>{visits.filter(v => v.patientId === patientId && !v.deletedAt).map(v => <SelectItem key={v.id} value={v.id}>{v.date} · {v.type}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Treatment Plan Item (optional)</Label><Select value={form.treatmentPlanItemId || "none"} onValueChange={v => setForm(f => ({ ...f, treatmentPlanItemId: v === "none" ? "" : v }))}><SelectTrigger className="min-h-[48px] mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">General patient payment</SelectItem>{planItems.map(i => <SelectItem key={i.id} value={i.id}>{i.procedure} · Tooth {i.toothNumber}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="mt-1" /></div>
            <Button className="w-full min-h-[48px]" onClick={submit}>Save Payment</Button>
            <p className="text-xs text-muted-foreground">Do not enter card numbers, CVV codes, passwords, or other payment credentials.</p>
          </div>
        </SheetContent>
      </Sheet>

      <section className="border rounded-xl overflow-hidden bg-card">
        <div className="p-4 border-b flex items-center gap-2"><Receipt className="h-4 w-4 text-primary" /><h4 className="font-semibold">Financial Transaction History</h4></div>
        {transactions.length === 0 ? <EmptyState icon={WalletCards} title="No financial activity" description="Add treatment plan costs or record a payment to begin." /> : (
          <div className="divide-y">
            {transactions.map(tx => <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div><p className="font-medium">{tx.description}</p><p className="text-xs text-muted-foreground">{tx.date} · {tx.type}{tx.notes ? ` · ${tx.notes}` : ""}</p></div>
              <div className={`font-semibold ${tx.type === "Payment" ? "text-green-600" : ""}`}>{tx.type === "Payment" ? "+" : ""}{money(tx.amount, tx.currency)}</div>
            </div>)}
          </div>
        )}
      </section>

      <section className="border rounded-xl overflow-hidden bg-card">
        <div className="p-4 border-b flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /><h4 className="font-semibold">Recorded Payments</h4><Badge variant="secondary">{patientPayments.length}</Badge></div>
        {patientPayments.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No payments recorded.</p> : <div className="divide-y">{patientPayments.map(p => <div key={p.id} className="p-4 flex items-center justify-between gap-3"><div><p className="font-medium">{money(p.amount, p.currency)} · {p.paymentMethod}</p><p className="text-xs text-muted-foreground">{p.date}{p.treatmentPlanItemId ? " · Allocated to treatment" : " · General payment"}</p></div><Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive min-h-[40px] min-w-[40px]" onClick={() => deletePayment(p.id)}><Trash2 className="h-4 w-4" /></Button></div>)}</div>}
      </section>
    </div>
  );
}