import { Sidebar } from "@/components/Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[100dvh] bg-background w-full overflow-hidden text-foreground">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
