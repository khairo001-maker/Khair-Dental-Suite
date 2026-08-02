import { Layout } from "@/components/Layout";
import { useLanguage } from "@/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Globe, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-bold">{t("nav.settings")}</h1>
        </header>

        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">{t("settings.clinic_info")}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Clinic Name</Label>
                <Input defaultValue="Khair Dental Suite" className="min-h-[48px]" />
              </div>
              <div className="space-y-2">
                <Label>License Number</Label>
                <Input defaultValue="KDS-2024-001" className="min-h-[48px]" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+966 50 123 4567" className="min-h-[48px]" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="hello@khairdental.com" className="min-h-[48px]" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input defaultValue="123 Medical Dist, Riyadh" className="min-h-[48px]" />
              </div>
            </div>
            <div className="mt-4">
              <Button className="min-h-[44px]">Save Information</Button>
            </div>
          </div>

          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">{t("settings.language")}</h2>
            <div className="flex gap-4">
              <Button 
                variant={language === 'en' ? 'default' : 'outline'} 
                className="min-h-[48px] w-32"
                onClick={() => setLanguage('en')}
              >
                <Globe className="h-4 w-4 mr-2" />
                English
              </Button>
              <Button 
                variant={language === 'ar' ? 'default' : 'outline'} 
                className="min-h-[48px] w-32"
                onClick={() => setLanguage('ar')}
              >
                <Globe className="h-4 w-4 mr-2" />
                العربية
              </Button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t("settings.display")}</h2>
            <div className="flex gap-4">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                className="min-h-[48px] w-32"
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                className="min-h-[48px] w-32"
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
