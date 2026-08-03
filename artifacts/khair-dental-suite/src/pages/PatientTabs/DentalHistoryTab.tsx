import { Patient } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";

interface Props {
  patient: Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  t: (key: string) => string;
}

export default function DentalHistoryTab({ patient, updatePatient, t }: Props) {
  const [editingField, setEditingField] = useState<string | null>(null);
  
  const dh = patient.dentalHistory || {
    lastDentalVisit: "",
    previousDentist: "",
    chiefComplaint: "",
    dentalAnxiety: "None",
    previousTreatments: "",
    notes: ""
  };

  const handleSave = (field: keyof typeof dh, value: string) => {
    updatePatient(patient.id, {
      dentalHistory: { ...dh, [field]: value }
    });
    setEditingField(null);
  };

  const renderField = (label: string, field: keyof typeof dh, type: 'text' | 'textarea' | 'date' | 'select' = 'text', options?: string[]) => {
    const isEditing = editingField === field;
    const val = dh[field];

    return (
      <div className="group border-b last:border-0 pb-4 last:pb-0">
        <div className="text-sm font-medium text-muted-foreground mb-1">{label}</div>
        {isEditing ? (
          <div className="flex gap-2 items-start mt-2">
            {type === 'textarea' ? (
              <Textarea 
                defaultValue={val} 
                onBlur={(e) => handleSave(field, e.target.value)}
                autoFocus
                className="min-h-[100px]"
              />
            ) : type === 'select' ? (
              <Select defaultValue={val} onValueChange={(v) => handleSave(field, v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {options?.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            ) : (
              <Input 
                type={type} 
                defaultValue={val} 
                onBlur={(e) => handleSave(field, e.target.value)}
                autoFocus
                className="h-10"
              />
            )}
          </div>
        ) : (
          <div 
            className="flex items-center justify-between p-2 -mx-2 rounded-md hover:bg-muted/50 cursor-pointer group-hover:bg-muted/30"
            onClick={() => setEditingField(field)}
          >
            <span className={!val ? "text-muted-foreground italic" : "whitespace-pre-wrap"}>
              {val || "Click to add..."}
            </span>
            <Pencil className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {renderField(t("patient.last_dental_visit"), "lastDentalVisit", "date")}
          {renderField(t("patient.dental_anxiety"), "dentalAnxiety", "select", ["None", "Mild", "Moderate", "Severe"])}
          {renderField("Previous Dentist", "previousDentist", "text")}
          {renderField(t("patient.chief_complaint"), "chiefComplaint", "text")}
        </div>
        <div className="mt-6 pt-4 border-t space-y-4">
          {renderField(t("patient.previous_treatments"), "previousTreatments", "textarea")}
          {renderField("Dental Notes", "notes", "textarea")}
        </div>
      </CardContent>
    </Card>
  );
}
