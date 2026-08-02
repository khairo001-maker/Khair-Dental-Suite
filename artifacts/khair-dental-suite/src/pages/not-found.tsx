import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
        <span className="text-4xl font-bold">404</span>
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
