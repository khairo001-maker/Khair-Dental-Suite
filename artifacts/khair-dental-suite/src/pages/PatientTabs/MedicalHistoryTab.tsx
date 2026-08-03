import { Patient } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  patient: Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  t: (key: string) => string;
}

export default function MedicalHistoryTab({ patient, updatePatient, t }: Props) {
  const [newAllergy, setNewAllergy] = useState("");
  const [newMed, setNewMed] = useState("");
  const [newDisease, setNewDisease] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notesTemp, setNotesTemp] = useState(patient.medicalHistory?.notes || "");

  const addTag = (field: 'allergies' | 'medications' | 'systemicDiseases', val: string, setter: (v: string) => void) => {
    if (!val.trim()) return;
    const current = patient.medicalHistory?.[field] || [];
    updatePatient(patient.id, {
      medicalHistory: {
        ...patient.medicalHistory,
        [field]: [...current, val.trim()]
      } as any
    });
    setter("");
  };

  const removeTag = (field: 'allergies' | 'medications' | 'systemicDiseases', idx: number) => {
    const current = patient.medicalHistory?.[field] || [];
    updatePatient(patient.id, {
      medicalHistory: {
        ...patient.medicalHistory,
        [field]: current.filter((_, i) => i !== idx)
      } as any
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Allergies */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("patient.allergies")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!patient.medicalHistory?.allergies || patient.medicalHistory.allergies.length === 0) ? (
              <div className="flex items-center text-green-600 bg-green-50 p-2 rounded-md font-medium text-sm">
                <Check className="h-4 w-4 mr-2" /> {t("patient.no_allergies")}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.allergies.map((a, idx) => (
                  <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-900 border-amber-200 py-1 px-2.5">
                    {a}
                    <button onClick={() => removeTag('allergies', idx)} className="ml-2 hover:text-red-600"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input 
                placeholder="Add allergy..." 
                value={newAllergy}
                onChange={e => setNewAllergy(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTag('allergies', newAllergy, setNewAllergy); }}
                className="h-9 text-sm"
              />
              <Button size="sm" variant="secondary" onClick={() => addTag('allergies', newAllergy, setNewAllergy)}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("patient.medications")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!patient.medicalHistory?.medications || patient.medicalHistory.medications.length === 0) ? (
              <div className="text-sm text-muted-foreground italic">No current medications</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.medications.map((a, idx) => (
                  <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-900 border-blue-200 py-1 px-2.5">
                    {a}
                    <button onClick={() => removeTag('medications', idx)} className="ml-2 hover:text-red-600"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input 
                placeholder="Add medication..." 
                value={newMed}
                onChange={e => setNewMed(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTag('medications', newMed, setNewMed); }}
                className="h-9 text-sm"
              />
              <Button size="sm" variant="secondary" onClick={() => addTag('medications', newMed, setNewMed)}>Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Systemic Diseases */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{t("patient.systemic_diseases")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(!patient.medicalHistory?.systemicDiseases || patient.medicalHistory.systemicDiseases.length === 0) ? (
              <div className="text-sm text-muted-foreground italic">No known conditions</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.systemicDiseases.map((a, idx) => (
                  <Badge key={idx} variant="outline" className="bg-purple-50 text-purple-900 border-purple-200 py-1 px-2.5">
                    {a}
                    <button onClick={() => removeTag('systemicDiseases', idx)} className="ml-2 hover:text-red-600"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input 
                placeholder="Add condition..." 
                value={newDisease}
                onChange={e => setNewDisease(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addTag('systemicDiseases', newDisease, setNewDisease); }}
                className="h-9 text-sm"
              />
              <Button size="sm" variant="secondary" onClick={() => addTag('systemicDiseases', newDisease, setNewDisease)}>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Medical Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-2">{t("patient.smoking")}</div>
              <Badge variant="outline" className={
                patient.medicalHistory?.smoking === 'Current' ? 'bg-red-50 text-red-700' :
                patient.medicalHistory?.smoking === 'Former' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50'
              }>
                {patient.medicalHistory?.smoking || 'Never'}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">{t("patient.pregnancy")}</div>
              <Badge variant="outline" className={patient.medicalHistory?.pregnancy === 'Yes' ? 'bg-pink-50 text-pink-700 border-pink-200' : 'bg-gray-50'}>
                {patient.medicalHistory?.pregnancy || 'N/A'}
              </Badge>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-2">Medical Notes</div>
            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea 
                  value={notesTemp}
                  onChange={e => setNotesTemp(e.target.value)}
                  autoFocus
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => { setNotesTemp(patient.medicalHistory?.notes || ""); setIsEditingNotes(false); }}>Cancel</Button>
                  <Button onClick={() => {
                    updatePatient(patient.id, {
                      medicalHistory: { ...(patient.medicalHistory as any), notes: notesTemp }
                    });
                    setIsEditingNotes(false);
                  }}>Save Notes</Button>
                </div>
              </div>
            ) : (
              <div 
                className="p-4 bg-muted/30 rounded-md border min-h-[100px] cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setIsEditingNotes(true)}
              >
                {patient.medicalHistory?.notes ? (
                  <span className="whitespace-pre-wrap">{patient.medicalHistory.notes}</span>
                ) : (
                  <span className="text-muted-foreground italic">Click to add medical notes...</span>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
