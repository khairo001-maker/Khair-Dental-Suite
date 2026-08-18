import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PatientSelector } from "@/components/PatientSelector";
import { useDataStore } from "@/store/DataStore";
import { ToothStatus, TOOTH_STATUS_CONFIG } from "@/types";
import { OdontogramToothSheet } from "./OdontogramToothSheet";
import { Button } from "@/components/ui/button";
import { ScanLine, Info } from "lucide-react";

// FDI permanent dentition layout
const UPPER_RIGHT = [18, 17, 16, 15, 14, 13, 12, 11]; // right to left (from patient's view)
const UPPER_LEFT  = [21, 22, 23, 24, 25, 26, 27, 28]; // left to right
const LOWER_RIGHT = [48, 47, 46, 45, 44, 43, 42, 41];
const LOWER_LEFT  = [31, 32, 33, 34, 35, 36, 37, 38];

// Tooth name lookup for display in sheet header
const TOOTH_NAMES: Record<number, string> = {
  18: 'Upper Right 3rd Molar', 17: 'Upper Right 2nd Molar', 16: 'Upper Right 1st Molar',
  15: 'Upper Right 2nd Premolar', 14: 'Upper Right 1st Premolar', 13: 'Upper Right Canine',
  12: 'Upper Right Lateral Incisor', 11: 'Upper Right Central Incisor',
  21: 'Upper Left Central Incisor', 22: 'Upper Left Lateral Incisor', 23: 'Upper Left Canine',
  24: 'Upper Left 1st Premolar', 25: 'Upper Left 2nd Premolar', 26: 'Upper Left 1st Molar',
  27: 'Upper Left 2nd Molar', 28: 'Upper Left 3rd Molar',
  31: 'Lower Left Central Incisor', 32: 'Lower Left Lateral Incisor', 33: 'Lower Left Canine',
  34: 'Lower Left 1st Premolar', 35: 'Lower Left 2nd Premolar', 36: 'Lower Left 1st Molar',
  37: 'Lower Left 2nd Molar', 38: 'Lower Left 3rd Molar',
  41: 'Lower Right Central Incisor', 42: 'Lower Right Lateral Incisor', 43: 'Lower Right Canine',
  44: 'Lower Right 1st Premolar', 45: 'Lower Right 2nd Premolar', 46: 'Lower Right 1st Molar',
  47: 'Lower Right 2nd Molar', 48: 'Lower Right 3rd Molar',
};

// ── Single Tooth SVG ─────────────────────────────────────────────────────────
function ToothSVG({
  status,
  isUpperArch,
  hasRecords,
}: {
  status: ToothStatus;
  isUpperArch: boolean;
  hasRecords: boolean;
}) {
  const cfg = TOOTH_STATUS_CONFIG[status];
  const isMissingOrExtracted = status === 'Missing' || status === 'Extracted';

  return (
    <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Drop shadow filter */}
      <defs>
        <filter id="ts" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#00000018" />
        </filter>
      </defs>

      {/* Buccal surface — top (towards cheek) */}
      <polygon
        points="2,2 54,2 42,16 14,16"
        fill={cfg.fill}
        stroke={cfg.stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Distal surface — right (away from midline) */}
      <polygon
        points="54,2 54,54 42,40 42,16"
        fill={cfg.fill}
        stroke={cfg.stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Lingual/Palatal — bottom (towards tongue/palate) */}
      <polygon
        points="54,54 2,54 14,40 42,40"
        fill={cfg.fill}
        stroke={cfg.stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Mesial surface — left (towards midline) */}
      <polygon
        points="2,54 2,2 14,16 14,40"
        fill={cfg.fill}
        stroke={cfg.stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Occlusal/Incisal — center */}
      <rect
        x="14" y="16" width="28" height="24"
        rx="2"
        fill={cfg.centerFill}
        stroke={cfg.stroke}
        strokeWidth="1.5"
      />

      {/* Root Canal indicator — purple dot in center */}
      {status === 'Root Canal' && (
        <circle cx="28" cy="28" r="5" fill="#8b5cf6" opacity="0.8" />
      )}

      {/* Implant indicator — cross */}
      {status === 'Implant' && (
        <>
          <line x1="28" y1="22" x2="28" y2="34" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="28" x2="34" y2="28" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Missing / Extracted — red X */}
      {isMissingOrExtracted && (
        <>
          <line x1="8" y1="8" x2="48" y2="48" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="48" y1="8" x2="8" y2="48" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}

      {/* Records indicator — small teal dot in corner */}
      {hasRecords && !isMissingOrExtracted && (
        <circle
          cx={isUpperArch ? 48 : 8}
          cy={isUpperArch ? 8 : 48}
          r="4"
          fill="#0ea5e9"
          stroke="white"
          strokeWidth="1"
        />
      )}
    </svg>
  );
}

// ── Individual Tooth Button ───────────────────────────────────────────────────
function ToothButton({
  number,
  status,
  isUpperArch,
  isSelected,
  hasRecords,
  onClick,
}: {
  number: number;
  status: ToothStatus;
  isUpperArch: boolean;
  isSelected: boolean;
  hasRecords: boolean;
  onClick: () => void;
}) {
  const label = `${number}`;

  return (
    <button
      onClick={onClick}
      aria-label={`Tooth ${number}: ${TOOTH_NAMES[number]} — ${status}`}
      className={`
        flex flex-col items-center gap-1 group transition-transform active:scale-95
        ${isSelected ? 'scale-110' : 'hover:scale-105'}
      `}
    >
      {/* Number label — above for upper, below for lower */}
      {isUpperArch && (
        <span
          className={`text-[10px] font-bold leading-none transition-colors
            ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
        >
          {label}
        </span>
      )}

      {/* SVG tooth box */}
      <div
        className={`
          w-11 h-11 md:w-12 md:h-12 rounded-sm transition-all
          ${isSelected
            ? 'ring-2 ring-primary ring-offset-1 shadow-md'
            : 'ring-1 ring-border/60 hover:ring-primary/50 hover:shadow-sm'}
        `}
      >
        <ToothSVG status={status} isUpperArch={isUpperArch} hasRecords={hasRecords} />
      </div>

      {/* Number below for lower arch */}
      {!isUpperArch && (
        <span
          className={`text-[10px] font-bold leading-none transition-colors
            ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
        >
          {label}
        </span>
      )}
    </button>
  );
}

// ── Tooth Arch Row ────────────────────────────────────────────────────────────
function ArchRow({
  leftGroup,
  rightGroup,
  isUpperArch,
  selectedTooth,
  onToothClick,
  getStatus,
  hasRecords,
}: {
  leftGroup: number[];
  rightGroup: number[];
  isUpperArch: boolean;
  selectedTooth: number | null;
  onToothClick: (n: number) => void;
  getStatus: (n: number) => ToothStatus;
  hasRecords: (n: number) => boolean;
}) {
  return (
    <div className="flex items-center justify-center gap-0">
      {/* Left quadrant */}
      <div className="flex gap-1.5 pr-3">
        {leftGroup.map(n => (
          <ToothButton
            key={n}
            number={n}
            status={getStatus(n)}
            isUpperArch={isUpperArch}
            isSelected={selectedTooth === n}
            hasRecords={hasRecords(n)}
            onClick={() => onToothClick(n)}
          />
        ))}
      </div>

      {/* Midline separator */}
      <div className="flex flex-col items-center self-stretch justify-center px-1">
        <div className="w-px h-full bg-border/70 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-muted-foreground/30 border border-border/50" />
        </div>
      </div>

      {/* Right quadrant */}
      <div className="flex gap-1.5 pl-3">
        {rightGroup.map(n => (
          <ToothButton
            key={n}
            number={n}
            status={getStatus(n)}
            isUpperArch={isUpperArch}
            isSelected={selectedTooth === n}
            hasRecords={hasRecords(n)}
            onClick={() => onToothClick(n)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Status Legend ─────────────────────────────────────────────────────────────
function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {(Object.entries(TOOTH_STATUS_CONFIG) as [ToothStatus, typeof TOOTH_STATUS_CONFIG[ToothStatus]][]).map(
        ([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-3.5 h-3.5 rounded-sm border flex-shrink-0"
              style={{ backgroundColor: cfg.centerFill, borderColor: cfg.stroke }}
            />
            <span className="text-xs text-muted-foreground">{cfg.label}</span>
          </div>
        )
      )}
      <div className="flex items-center gap-1.5">
        <span className="w-3.5 h-3.5 rounded-full bg-sky-500 flex-shrink-0" />
        <span className="text-xs text-muted-foreground">Has records</span>
      </div>
    </div>
  );
}

// ── Main Odontogram Page ──────────────────────────────────────────────────────
export default function Odontogram() {
  const { toothRecords, toothDiagnoses, toothTreatments, toothRestorations,
          rootCanalTreatments, toothCrowns, toothImplants, toothExtractions,
          periodontalEntries, toothPhotos, toothRadiographs } = useDataStore();

  const [patientId, setPatientId] = useState<string>("");
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const getStatus = (toothNumber: number): ToothStatus => {
    if (!patientId) return 'Healthy';
    return toothRecords.find(r => r.patientId === patientId && r.toothNumber === toothNumber)?.status ?? 'Healthy';
  };

  const hasAnyRecords = (toothNumber: number): boolean => {
    if (!patientId) return false;
    return (
      toothDiagnoses.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothTreatments.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothRestorations.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      rootCanalTreatments.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothCrowns.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothImplants.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothExtractions.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      periodontalEntries.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothPhotos.some(r => r.patientId === patientId && r.toothNumber === toothNumber) ||
      toothRadiographs.some(r => r.patientId === patientId && r.toothNumber === toothNumber)
    );
  };

  const handleToothClick = (n: number) => {
    if (!patientId) return;
    setSelectedTooth(n);
    setSheetOpen(true);
  };

  const sharedArchProps = {
    selectedTooth,
    onToothClick: handleToothClick,
    getStatus,
    hasRecords: hasAnyRecords,
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-4">

        {/* ── Header ── */}
        <header className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-card border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Odontogram</h1>
              <p className="text-xs text-muted-foreground">FDI Permanent Dentition Chart</p>
            </div>
          </div>
          <div className="w-full sm:w-72">
            <PatientSelector
              value={patientId}
              onValueChange={(id) => { setPatientId(id); setSelectedTooth(null); }}
              placeholder="Select patient to chart…"
            />
          </div>
        </header>

        {!patientId ? (
          /* ── Empty state ── */
          <div className="bg-card border border-dashed rounded-xl flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="p-4 bg-muted/50 rounded-full">
              <ScanLine className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">No patient selected</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Select a patient above to begin charting their teeth.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Chart Card ── */}
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">

              {/* Quadrant labels */}
              <div className="flex border-b bg-muted/20">
                <div className="flex-1 flex">
                  <div className="flex-1 text-center py-2 text-xs font-semibold text-muted-foreground border-r">
                    Upper Right (Q1)
                  </div>
                  <div className="flex-1 text-center py-2 text-xs font-semibold text-muted-foreground">
                    Upper Left (Q2)
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-8 space-y-8 overflow-x-auto">
                <div className="min-w-[680px] space-y-10">

                  {/* Upper arch */}
                  <ArchRow
                    leftGroup={UPPER_RIGHT}
                    rightGroup={UPPER_LEFT}
                    isUpperArch={true}
                    {...sharedArchProps}
                  />

                  {/* Horizontal divider — represents occlusal plane */}
                  <div className="relative flex items-center">
                    <div className="flex-1 border-t-2 border-dashed border-primary/20" />
                    <div className="px-3 flex items-center gap-1.5 text-[10px] font-medium text-primary/60 uppercase tracking-widest">
                      <Info className="h-3 w-3" />
                      Occlusal Plane
                    </div>
                    <div className="flex-1 border-t-2 border-dashed border-primary/20" />
                  </div>

                  {/* Lower arch */}
                  <ArchRow
                    leftGroup={LOWER_RIGHT}
                    rightGroup={LOWER_LEFT}
                    isUpperArch={false}
                    {...sharedArchProps}
                  />

                </div>
              </div>

              {/* Quadrant labels — lower */}
              <div className="flex border-t bg-muted/20">
                <div className="flex-1 flex">
                  <div className="flex-1 text-center py-2 text-xs font-semibold text-muted-foreground border-r">
                    Lower Right (Q4)
                  </div>
                  <div className="flex-1 text-center py-2 text-xs font-semibold text-muted-foreground">
                    Lower Left (Q3)
                  </div>
                </div>
              </div>
            </div>

            {/* ── Legend ── */}
            <div className="bg-card border rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Legend
              </p>
              <StatusLegend />
            </div>

            {/* ── Tap hint on mobile ── */}
            <p className="text-center text-xs text-muted-foreground/60 pb-2">
              Tap any tooth to view or add clinical records
            </p>
          </>
        )}
      </div>

      {/* ── Tooth Detail Sheet ── */}
      {selectedTooth && patientId && (
        <OdontogramToothSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          toothNumber={selectedTooth}
          toothName={TOOTH_NAMES[selectedTooth] ?? `Tooth ${selectedTooth}`}
          patientId={patientId}
          currentStatus={getStatus(selectedTooth)}
        />
      )}
    </Layout>
  );
}
