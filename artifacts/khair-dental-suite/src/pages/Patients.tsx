import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { dataStore } from "@/data/mockData";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, User, Phone, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = useMemo(() => {
    return dataStore.patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
            <p className="text-muted-foreground mt-1">Manage patient records and histories.</p>
          </div>
          <Button data-testid="button-add-patient">
            <Plus className="mr-2 h-4 w-4" /> Add Patient
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-card p-4 rounded-lg border shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search-patients"
            />
          </div>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Next Appt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No patients found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} data-testid={`row-patient-${patient.id}`}>
                    <TableCell>
                      <div className="font-medium text-primary hover:underline">
                        <Link href={`/patients/${patient.id}`}>
                          {patient.name}
                        </Link>
                      </div>
                      <div className="text-xs text-muted-foreground">{patient.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        {patient.phone}
                      </div>
                      <div className="text-xs text-muted-foreground">{patient.email}</div>
                    </TableCell>
                    <TableCell>
                      {patient.lastVisit ? (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {patient.lastVisit}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {patient.nextAppointment ? (
                        <span className="text-sm font-medium">{patient.nextAppointment}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm text-center">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/patients/${patient.id}`}>View Profile</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Schedule Appointment</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit Record</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
