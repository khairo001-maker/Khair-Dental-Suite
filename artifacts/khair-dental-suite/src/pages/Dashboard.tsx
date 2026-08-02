import { Layout } from "@/components/Layout";
import { dataStore } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const weeklyRevenue = [
  { name: 'Mon', revenue: 1200 },
  { name: 'Tue', revenue: 2100 },
  { name: 'Wed', revenue: 1800 },
  { name: 'Thu', revenue: 2400 },
  { name: 'Fri', revenue: 3200 },
  { name: 'Sat', revenue: 1500 },
];

const appointmentTypes = [
  { name: 'Checkup', value: 35 },
  { name: 'Cleaning', value: 25 },
  { name: 'Root Canal', value: 10 },
  { name: 'Filling', value: 20 },
  { name: 'Other', value: 10 },
];

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = dataStore.appointments.filter(a => a.date === today);
  const activePatientsCount = dataStore.patients.filter(p => p.status === 'active').length;
  
  const totalRevenue = dataStore.invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const pendingInvoices = dataStore.invoices.filter(i => i.status === 'pending').length;

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back, Dr. Khair. Here's what's happening today.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                2 pending confirmation
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePatientsCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +4 new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingInvoices} invoices pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clinic Efficiency</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Weekly revenue breakdown by day</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <RechartsTooltip 
                      cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Appointments for {new Date().toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayAppointments.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No appointments today</div>
                ) : (
                  todayAppointments.sort((a, b) => a.time.localeCompare(b.time)).map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-sm font-semibold">{apt.time}</div>
                        <div className="text-xs text-muted-foreground">{apt.duration}m</div>
                      </div>
                      <div className="w-px h-10 bg-border"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{apt.patientName}</p>
                        <p className="text-xs text-muted-foreground truncate">{apt.type}</p>
                      </div>
                      <Badge 
                        variant={apt.status === 'completed' ? 'secondary' : 'default'}
                        className={apt.status === 'scheduled' ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
