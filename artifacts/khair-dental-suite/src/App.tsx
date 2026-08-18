import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from 'next-themes';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { LanguageProvider } from '@/i18n';
import { DataStoreProvider } from '@/store/DataStore';

import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import PatientDetail from '@/pages/PatientDetail';
import Visits from '@/pages/Visits';
import ClinicalCases from '@/pages/ClinicalCases';
import Odontogram from '@/pages/Odontogram';
import Endodontics from '@/pages/Endodontics';
import Implantology from '@/pages/Implantology';
import Prosthodontics from '@/pages/Prosthodontics';
import Radiology from '@/pages/Radiology';
import Photos from '@/pages/Photos';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import FinancialDashboard from '@/pages/FinancialDashboard';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/patients" component={Patients} />
      <Route path="/patients/:id" component={PatientDetail} />
      <Route path="/visits" component={Visits} />
      <Route path="/clinical-cases" component={ClinicalCases} />
      <Route path="/odontogram" component={Odontogram} />
      <Route path="/endodontics" component={Endodontics} />
      <Route path="/implantology" component={Implantology} />
      <Route path="/prosthodontics" component={Prosthodontics} />
      <Route path="/radiology" component={Radiology} />
      <Route path="/photos" component={Photos} />
      <Route path="/reports" component={Reports} />
      <Route path="/settings" component={Settings} />
      <Route path="/financial" component={FinancialDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <DataStoreProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </DataStoreProvider>
    </LanguageProvider>
  );
}

export default App;
