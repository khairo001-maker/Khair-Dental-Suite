import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Calendar,
  Smile, 
  Zap, 
  Layers, 
  Package, 
  ScanLine, 
  Camera, 
  BarChart3, 
  Settings,
  Globe
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { href: "/", label: t("nav.dashboard"), icon: LayoutDashboard },
    { href: "/patients", label: t("nav.patients"), icon: Users },
     { href: "/visits", label: t("nav.visits"), icon: Calendar },
    { href: "/clinical-cases", label: t("nav.clinical_cases"), icon: ClipboardList },
    { href: "/odontogram", label: t("nav.odontogram"), icon: Smile },
    { href: "/endodontics", label: t("nav.endodontics"), icon: Zap },
    { href: "/implantology", label: t("nav.implantology"), icon: Layers },
    { href: "/prosthodontics", label: t("nav.prosthodontics"), icon: Package },
    { href: "/radiology", label: t("nav.radiology"), icon: ScanLine },
    { href: "/photos", label: t("nav.photos"), icon: Camera },
    { href: "/reports", label: t("nav.reports"), icon: BarChart3 },
    { href: "/settings", label: t("nav.settings"), icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col h-full shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2.5 rounded-lg text-primary-foreground">
          <Smile className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-white">{t("app.title")}</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-md transition-colors cursor-pointer text-sm font-medium min-h-[52px]",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border mt-auto">
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground min-h-[44px]"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
        >
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </div>
          <span className="text-xs uppercase bg-sidebar-accent/50 px-2 py-1 rounded">
            {language}
          </span>
        </Button>
      </div>
    </aside>
  );
}
