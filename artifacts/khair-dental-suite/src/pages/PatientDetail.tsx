import { useParams, Link } from "wouter";
import { Layout } from "@/components/Layout";
import { dataStore } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, FileText, Activity, Phone, Mail, MapPin, AlertTriangle } from "lucide-react";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  
  const patient = dataStore.patients.find(p => p.id === id);
  const appointments = dataStore.appointments.filter(a => a.patientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const treatments = dataStore.treatments.filter(t => t.patientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const invoices = dataStore.invoices.filter(i => i.patientId === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!patient) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <h2 className="text-2xl font-bold">Patient Not Found</h2>
          <p className="text-muted-foreground">The patient ID {id} does not exist in our records.</p>
          <Link href="/patients">
            <Button variant="outline"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Patients</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <Link href="/patients">
            <span className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer mb-4 inline-flex w-fit">
              <ChevronLeft className="h-4 w-4" /> Back to patients
            </span>
          </Link>
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Badge variant="outline">{patient.id}</Badge></span>
                  <span>{patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yrs</span>
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>{patient.status}</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Edit Patient</Button>
              <Button>New Appointment</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-muted-foreground">{patient.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{patient.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-muted-foreground">{patient.address}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-3 text-sm">
                <h4 className="font-semibold mb-2">Medical Overview</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Type</span>
                  <span className="font-medium">{patient.bloodType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground flex items-center gap-1 mb-1">
                    <AlertTriangle className="h-3 w-3" /> Allergies
                  </span>
                  {patient.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {patient.allergies.map(a => (
                        <Badge key={a} variant="destructive" className="bg-destructive/10 text-destructive border-transparent hover:bg-destructive/20">{a}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="font-medium">None known</span>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-3 text-sm">
                <h4 className="font-semibold mb-2">Insurance</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium">{patient.insuranceProvider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number</span>
                  <span className="font-medium font-mono">{patient.insuranceNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="appointments" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="treatments">Treatments</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appointments" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" /> Appointment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appointments.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No appointments found.</p>
                    ) : (
                      <div className="space-y-4">
                        {appointments.map(apt => (
                          <div key={apt.id} className="flex justify-between items-center p-3 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="bg-muted p-2 rounded text-center min-w-14">
                                <div className="text-xs font-semibold uppercase">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</div>
                                <div className="text-lg font-bold leading-tight">{new Date(apt.date).getDate()}</div>
                              </div>
                              <div>
                                <p className="font-medium">{apt.type.charAt(0).toUpperCase() + apt.type.slice(1)}</p>
                                <p className="text-xs text-muted-foreground">{apt.time} ({apt.duration}m) with {apt.dentistName}</p>
                              </div>
                            </div>
                            <Badge variant={
                              apt.status === 'completed' ? 'secondary' : 
                              apt.status === 'scheduled' ? 'default' : 
                              'destructive'
                            }>{apt.status}</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="treatments" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" /> Treatment Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {treatments.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No treatments found.</p>
                    ) : (
                      <div className="space-y-4">
                        {treatments.map(t => (
                          <div key={t.id} className="border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-medium text-primary">{t.procedure}</h4>
                              <span className="text-sm font-medium">${t.cost}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                              <span>{t.date}</span>
                              <span>•</span>
                              <span>{t.dentistName}</span>
                              {t.toothNumber && (
                                <>
                                  <span>•</span>
                                  <span>Tooth #{t.toothNumber}</span>
                                </>
                              )}
                            </div>
                            <p className="text-sm">{t.description}</p>
                            <div className="mt-2">
                              <Badge variant={t.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                                {t.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="billing" className="mt-4 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" /> Invoices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {invoices.length === 0 ? (
                      <p className="text-muted-foreground text-sm text-center py-4">No invoices found.</p>
                    ) : (
                      <div className="space-y-4">
                        {invoices.map(inv => (
                          <div key={inv.id} className="flex justify-between items-center p-3 rounded-lg border bg-card">
                            <div>
                              <p className="font-medium">{inv.id}</p>
                              <p className="text-xs text-muted-foreground">Issued: {inv.date} • Due: {inv.dueDate}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">${inv.total}</p>
                              <Badge variant={
                                inv.status === 'paid' ? 'secondary' : 
                                inv.status === 'pending' ? 'outline' : 
                                'destructive'
                              } className="mt-1">
                                {inv.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
