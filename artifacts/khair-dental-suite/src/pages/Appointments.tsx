import { Layout } from "@/components/Layout";
import { dataStore } from "@/data/mockData";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Appointments() {
  const [viewDate, setViewDate] = useState(new Date());
  
  // Format for matching with mock data (YYYY-MM-DD)
  const dateStr = viewDate.toISOString().split('T')[0];
  
  const dayAppointments = dataStore.appointments
    .filter(a => a.date === dateStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const changeDate = (days: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + days);
    setViewDate(newDate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-muted text-muted-foreground border-transparent';
      case 'scheduled': return 'bg-primary text-primary-foreground border-transparent';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-transparent';
      case 'no-show': return 'bg-destructive/20 text-destructive border-transparent';
      default: return 'bg-secondary text-secondary-foreground border-transparent';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground mt-1">Manage the clinic's daily schedule.</p>
          </div>
          <Button data-testid="button-new-appointment">
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </Button>
        </div>

        <div className="flex-1 flex gap-6 min-h-0">
          {/* Mini Calendar Side */}
          <div className="w-80 flex-shrink-0 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-center pb-4 font-semibold border-b mb-4 flex justify-between items-center">
                  <Button variant="ghost" size="icon" onClick={() => changeDate(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  <Button variant="ghost" size="icon" onClick={() => changeDate(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                {/* A simplified static visual calendar for the sake of the design */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground font-medium">
                  <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                  {/* Just some dummy days for visual context */}
                  {[...Array(30)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`p-2 rounded-full cursor-pointer hover:bg-accent ${
                        i+1 === viewDate.getDate() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
                      }`}
                      onClick={() => {
                        const d = new Date(viewDate);
                        d.setDate(i+1);
                        setViewDate(d);
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-sm">Quick Stats ({dateStr})</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{dayAppointments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {dayAppointments.filter(a => a.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium text-primary">
                    {dayAppointments.filter(a => a.status === 'scheduled').length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Schedule View */}
          <Card className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-card">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {viewDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Button variant="outline" size="sm" onClick={() => setViewDate(new Date())}>Today</Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {dayAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Clock className="h-12 w-12 mb-4 opacity-20" />
                  <p>No appointments scheduled for this day.</p>
                </div>
              ) : (
                <div className="relative border-l-2 border-border ml-16 pl-6 space-y-6">
                  {dayAppointments.map(apt => (
                    <div key={apt.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                      
                      {/* Time marker */}
                      <div className="absolute -left-20 top-0.5 text-sm font-semibold w-12 text-right">
                        {apt.time}
                      </div>

                      <Card className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-lg">{apt.patientName}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {apt.type.charAt(0).toUpperCase() + apt.type.slice(1)} • {apt.duration} mins
                                </p>
                              </div>
                              <Badge className={getStatusColor(apt.status)}>
                                {apt.status}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm mt-3">
                              <span className="flex items-center gap-1 font-medium bg-accent/50 px-2 py-1 rounded text-accent-foreground">
                                {apt.dentistName}
                              </span>
                              {apt.notes && (
                                <span className="text-muted-foreground italic truncate">
                                  "{apt.notes}"
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col justify-center gap-2 border-l pl-4">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">Edit</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
