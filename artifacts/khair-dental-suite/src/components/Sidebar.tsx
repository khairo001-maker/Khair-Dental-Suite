import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  CreditCard, 
  Settings, 
  Stethoscope, 
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patients", label: "Patients", icon: Users },
    { href: "/appointments", label: "Appointments", icon: Calendar },
    { href: "/treatments", label: "Treatments", icon: ClipboardList },
    { href: "/billing", label: "Billing", icon: CreditCard },
    { href: "/staff", label: "Staff", icon: Stethoscope },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r bg-sidebar text-sidebar-foreground flex flex-col h-screen overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-lg text-primary">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">Khair Dental</h1>
          <p className="text-xs text-sidebar-foreground/60">Practice Suite</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div 
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors cursor-pointer text-sm font-medium ${
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center justify-between px-3 py-2 rounded-md bg-sidebar-accent/30 text-sm mb-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs">
              SK
            </div>
            <div>
              <p className="font-medium">Dr. S. Khair</p>
              <p className="text-xs text-sidebar-foreground/60">Admin</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="flex-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="flex-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
