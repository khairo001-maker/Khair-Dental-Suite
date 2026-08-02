import { Layout } from "@/components/Layout";
import { dataStore } from "@/data/mockData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function Treatments() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = dataStore.treatments.filter(t => 
    t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.procedure.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Treatment Records</h1>
          <p className="text-muted-foreground mt-1">Log of all procedures performed.</p>
        </div>

        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by patient or procedure..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Procedure</TableHead>
                <TableHead>Tooth</TableHead>
                <TableHead>Dentist</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="font-medium text-primary">{t.patientName}</TableCell>
                  <TableCell>
                    <div className="font-medium">{t.procedure}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-xs">{t.description}</div>
                  </TableCell>
                  <TableCell>{t.toothNumber ? `#${t.toothNumber}` : '-'}</TableCell>
                  <TableCell className="text-sm">{t.dentistName}</TableCell>
                  <TableCell className="text-right font-medium">${t.cost.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
