import { Layout } from "@/components/Layout";
import { useDataStore } from "@/store/DataStore";
import { useLanguage } from "@/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, TrendingUp, Users, WalletCards } from "lucide-react";
import { Currency } from "@/types";

const currencies: Currency[] = ["EUR", "USD", "TRY", "SYP"];
const money = (amount: number, currency: Currency) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);

export default function FinancialDashboard() {
  const { t } = useLanguage();
  const { payments, patients, treatmentPlanItems } = useDataStore();
  const activePayments = payments.filter(p => !p.deletedAt);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = startOfDay - ((now.getDay() + 6) % 7) * 86400000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const sumSince = (since: number) => activePayments.filter(p => new Date(p.date).getTime() >= since).reduce<Record<string, number>>((a, p) => ({ ...a, [p.currency]: (a[p.currency] || 0) + p.amount }), {});
  const today = sumSince(startOfDay);
  const week = sumSince(startOfWeek);
  const month = sumSince(startOfMonth);

  const balances = patients.map(patient => currencies.map(currency => {
    const cost = treatmentPlanItems.filter(i => i.patientId === patient.id && i.status !== "Cancelled" && (i.estimatedCost || 0) > 0).reduce((s, i) => s + (i.estimatedCost || 0), 0);
    const paid = activePayments.filter(p => p.patientId === patient.id && p.currency === currency).reduce((s, p) => s + p.amount, 0);
    return { patient, currency, balance: cost - paid };
  })).flat().filter(x => x.balance > 0);
  const patientIdsWithBalance = new Set(balances.map(x => x.patient.id));

  const Summary = ({ title, data, icon }: { title: string; data: Record<string, number>; icon: React.ReactNode }) => (
    <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-sm text-muted-foreground">{icon}{title}</div><div className="mt-3 space-y-1">{Object.keys(data).length === 0 ? <p className="text-2xl font-bold">—</p> : Object.entries(data).map(([c, v]) => <p key={c} className="text-xl font-bold">{money(v, c as Currency)}</p>)}</div></CardContent></Card>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header><h1 className="text-3xl font-bold tracking-tight">{t("nav.financial_dashboard")}</h1><p className="text-muted-foreground mt-1">{t("financial.dashboard_subtitle")}</p></header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Summary title={t("financial.today_payments")} data={today} icon={<CreditCard className="h-4 w-4" />} />
          <Summary title={t("financial.week_payments")} data={week} icon={<TrendingUp className="h-4 w-4" />} />
          <Summary title={t("financial.month_payments")} data={month} icon={<WalletCards className="h-4 w-4" />} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="p-5"><div className="flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" /> {t("financial.patients_with_balance")}</div><p className="text-3xl font-bold mt-3">{patientIdsWithBalance.size}</p><p className="text-xs text-muted-foreground mt-1">{t("financial.outstanding_patients_subtitle")}</p></CardContent></Card>
          <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">{t("financial.outstanding_balances")}</p><div className="mt-3 flex flex-wrap gap-2">{currencies.map(c => { const value = balances.filter(x => x.currency === c).reduce((s, x) => s + x.balance, 0); return value > 0 ? <Badge key={c} variant="outline">{money(value, c)}</Badge> : null; })}</div><p className="text-xs text-muted-foreground mt-3">{t("financial.no_currency_conversion")}</p></CardContent></Card>
        </div>
      </div>
    </Layout>
  );
}