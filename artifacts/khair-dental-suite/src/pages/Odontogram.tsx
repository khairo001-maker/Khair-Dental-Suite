import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { PatientSelector } from "@/components/PatientSelector";
import { Button } from "@/components/ui/button";
import { ToothState, ToothCondition } from "@/types";

// Upper: 18-11, 21-28
const upperTeeth = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
// Lower: 48-41, 31-38
const lowerTeeth = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];

const defaultSurfaces = {
  mesial: { condition: 'Healthy' as ToothCondition },
  distal: { condition: 'Healthy' as ToothCondition },
  occlusal: { condition: 'Healthy' as ToothCondition },
  buccal: { condition: 'Healthy' as ToothCondition },
  lingual: { condition: 'Healthy' as ToothCondition },
};

function Tooth({ number, state, onClick }: { number: number, state?: ToothState, onClick: (t: number) => void }) {
  // A simplified rendering of a tooth as a box divided into 5 zones
  const isMissing = state?.overallCondition === 'Missing';
  const c = isMissing ? 'opacity-20' : '';

  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => onClick(number)}>
      <span className="text-xs font-semibold text-muted-foreground">{number}</span>
      <div className={`relative w-12 h-12 border rounded-sm overflow-hidden bg-white ${c}`}>
        {/* We can use CSS borders to draw the 5 zones (occlusal in middle, others on sides) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border bg-gray-50 z-10" />
        </div>
        <div className="absolute inset-0">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="0,0 100,0 75,25 25,25" fill="#f8fafc" stroke="#e2e8f0" />
            <polygon points="100,0 100,100 75,75 75,25" fill="#f8fafc" stroke="#e2e8f0" />
            <polygon points="100,100 0,100 25,75 75,75" fill="#f8fafc" stroke="#e2e8f0" />
            <polygon points="0,100 0,0 25,25 25,75" fill="#f8fafc" stroke="#e2e8f0" />
            <rect x="25" y="25" width="50" height="50" fill="#f1f5f9" stroke="#e2e8f0" />
            {isMissing && <line x1="0" y1="0" x2="100" y2="100" stroke="red" strokeWidth="4" />}
            {isMissing && <line x1="100" y1="0" x2="0" y2="100" stroke="red" strokeWidth="4" />}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Odontogram() {
  const { t } = useLanguage();
  const [patientId, setPatientId] = useState<string>("");

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border p-4 rounded-xl">
          <div className="w-full md:w-72">
            <PatientSelector value={patientId} onValueChange={setPatientId} placeholder={t("odontogram.select_patient")} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="min-h-[44px]">Reset</Button>
            <Button className="min-h-[44px]">Save Chart</Button>
          </div>
        </header>

        {!patientId ? (
          <div className="text-center py-20 text-muted-foreground bg-card border rounded-xl border-dashed">
            {t("odontogram.select_patient")}
          </div>
        ) : (
          <div className="bg-card border rounded-xl p-8 overflow-x-auto">
            <div className="min-w-[800px] flex flex-col gap-12 items-center">
              
              <div className="w-full flex flex-col items-center">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{t("odontogram.maxilla")}</h3>
                <div className="flex gap-2">
                  <div className="flex gap-2 border-r-2 border-primary/20 pr-4">
                    {upperTeeth.slice(0, 8).map(t => <Tooth key={t} number={t} onClick={(n) => console.log(n)} />)}
                  </div>
                  <div className="flex gap-2 pl-4">
                    {upperTeeth.slice(8).map(t => <Tooth key={t} number={t} onClick={(n) => console.log(n)} />)}
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-border my-2 relative">
                <div className="absolute left-1/2 -top-2 w-4 h-4 bg-primary/10 rounded-full -translate-x-1/2"></div>
              </div>

              <div className="w-full flex flex-col items-center">
                <div className="flex gap-2 mb-4">
                  <div className="flex gap-2 border-r-2 border-primary/20 pr-4">
                    {lowerTeeth.slice(0, 8).map(t => <Tooth key={t} number={t} onClick={(n) => console.log(n)} />)}
                  </div>
                  <div className="flex gap-2 pl-4">
                    {lowerTeeth.slice(8).map(t => <Tooth key={t} number={t} onClick={(n) => console.log(n)} />)}
                  </div>
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t("odontogram.mandible")}</h3>
              </div>

            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
