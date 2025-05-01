import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "accent" | "white";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  className,
  text,
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  const colorClasses = {
    primary: "border-primary border-t-transparent",
    secondary: "border-secondary border-t-transparent",
    accent: "border-pink-500 border-t-transparent",
    white: "border-white border-t-transparent",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color],
        )}
        role="status"
        aria-label="Loading"
      />
      {text && <span>{text}</span>}
    </div>
  );
}
