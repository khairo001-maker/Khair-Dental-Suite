import { useDataStore } from "@/store/DataStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/i18n";

interface PatientSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function PatientSelector({ value, onValueChange, placeholder }: PatientSelectorProps) {
  const { patients } = useDataStore();
  const { t } = useLanguage();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full min-h-[48px] bg-background">
        <SelectValue placeholder={placeholder || t("patients.search")} />
      </SelectTrigger>
      <SelectContent>
        {patients.length === 0 ? (
          <div className="p-4 text-sm text-center text-muted-foreground">
            {t("patients.empty")}
          </div>
        ) : (
          patients.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.fullName} ({p.phone})
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
