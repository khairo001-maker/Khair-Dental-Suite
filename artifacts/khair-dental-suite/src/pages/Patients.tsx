import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { useDataStore } from "@/store/DataStore";
import { EmptyState } from "@/components/EmptyState";
import { Users, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function Patients() {
  const { t } = useLanguage();
  const { patients, addPatient } = useDataStore();
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = patients.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()));

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addPatient({
      fullName: fd.get("fullName") as string,
      dob: fd.get("dob") as string,
      gender: fd.get("gender") as any,
      phone: fd.get("phone") as string,
      email: fd.get("email") as string,
      nationalId: fd.get("nationalId") as string,
      bloodType: fd.get("bloodType") as string,
      allergies: fd.get("allergies") as string,
      insuranceProvider: fd.get("insurance") as string,
      notes: fd.get("notes") as string,
      status: 'Active',
      lastVisit: new Date().toISOString().split('T')[0]
    });
    setIsOpen(false);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">{t("nav.patients")}</h1>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="min-h-[44px]">
                <Plus className="h-4 w-4 mr-2" />
                {t("action.new_patient")}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>{t("action.new_patient")}</SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t("form.full_name")}</Label>
                  <Input name="fullName" required className="min-h-[48px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("form.dob")}</Label>
                    <Input type="date" name="dob" required className="min-h-[48px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.gender")}</Label>
                    <select name="gender" className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("form.phone")}</Label>
                    <Input name="phone" type="tel" required className="min-h-[48px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.email")}</Label>
                    <Input name="email" type="email" className="min-h-[48px]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t("form.national_id")}</Label>
                    <Input name="nationalId" className="min-h-[48px]" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("form.blood_type")}</Label>
                    <Input name="bloodType" className="min-h-[48px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t("form.allergies")}</Label>
                  <Input name="allergies" className="min-h-[48px]" />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.insurance")}</Label>
                  <Input name="insurance" className="min-h-[48px]" />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.notes")}</Label>
                  <textarea name="notes" className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full min-h-[44px]">{t("form.save")}</Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </header>

        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="p-4 border-b bg-muted/20">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder={t("patients.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 min-h-[48px]"
              />
            </div>
          </div>
          
          {patients.length === 0 ? (
            <EmptyState 
              icon={Users}
              title={t("patients.empty")}
              description={t("patients.empty_subtext")}
              actionLabel={t("action.new_patient")}
              onAction={() => setIsOpen(true)}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">{t("patients.name")}</th>
                    <th className="px-6 py-4 font-medium">{t("patients.phone")}</th>
                    <th className="px-6 py-4 font-medium">{t("patients.last_visit")}</th>
                    <th className="px-6 py-4 font-medium">{t("patients.status")}</th>
                    <th className="px-6 py-4 font-medium text-right">{t("patients.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors h-[56px]">
                      <td className="px-6 py-2 font-medium">{p.fullName}</td>
                      <td className="px-6 py-2">{p.phone}</td>
                      <td className="px-6 py-2">{p.lastVisit}</td>
                      <td className="px-6 py-2">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`/patients/${p.id}`}>View</a>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
