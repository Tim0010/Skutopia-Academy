import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ className, size = "default" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <Loader2
      className={cn("animate-spin", sizeClasses[size], className)}
    />
  );
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" className="text-primary mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <LoadingSpinner size="xl" className="text-primary mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
