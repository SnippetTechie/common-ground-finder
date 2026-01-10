import { cn } from "@/lib/utils";
import { Check } from "lucide-react";


export interface InterestChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function InterestChip({ label, selected, onClick, className }: InterestChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-300 relative",
        selected
          ? "border-primary bg-primary/5 text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">{label}</span>
      <div className={cn(
        "h-4 w-4 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0",
        selected
          ? "border-primary bg-primary text-primary-foreground scale-100"
          : "border-border group-hover:border-primary/50 scale-90 group-hover:scale-100"
      )}>
        <Check className={cn(
          "h-2.5 w-2.5 transition-all duration-300",
          selected ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )} />
      </div>
    </button>
  );
}
