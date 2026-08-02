import { Layout } from "@/components/Layout";
import { dataStore } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone } from "lucide-react";

export default function Staff() {
  const staff = dataStore.staff;

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clinic Staff</h1>
          <p className="text-muted-foreground mt-1">Directory of dentists, hygienists, and administration.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {staff.map(person => (
            <Card key={person.id} className="overflow-hidden">
              <div className="h-2 bg-primary w-full"></div>
              <CardContent className="p-6">
                <div className="flex gap-4 items-start mb-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                    {person.avatarInitials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{person.name}</h3>
                    <p className="text-sm text-primary font-medium capitalize">{person.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{person.specialization}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3 w-3" /> {person.phone}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3 w-3" /> {person.email}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Schedule</p>
                  <div className="flex flex-wrap gap-1">
                    {person.schedule.map(day => (
                      <Badge key={day} variant="secondary" className="text-xs font-normal bg-accent/50">
                        {day.substring(0, 3)}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
