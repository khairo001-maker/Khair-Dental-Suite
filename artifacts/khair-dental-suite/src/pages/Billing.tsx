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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Billing() {
  const invoices = dataStore.invoices;

  const totalOutstanding = invoices
    .filter(i => i.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalCollected = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
            <p className="text-muted-foreground mt-1">Manage patient invoices and payments.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Outstanding Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">${totalOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Collected (This Month)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${totalCollected.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">4</div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Date / Due</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                  <TableCell className="font-medium text-primary">{inv.patientName}</TableCell>
                  <TableCell>
                    <div className="text-sm">{inv.date}</div>
                    <div className="text-xs text-muted-foreground">Due: {inv.dueDate}</div>
                  </TableCell>
                  <TableCell className="font-bold">${inv.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      inv.status === 'paid' ? 'secondary' : 
                      inv.status === 'pending' ? 'outline' : 
                      'destructive'
                    }>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
