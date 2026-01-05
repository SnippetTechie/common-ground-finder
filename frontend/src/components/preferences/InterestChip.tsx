import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface InterestChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function InterestChip({ label, selected, onClick }: InterestChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between gap-3 px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-300",
        selected
          ? "border-primary bg-primary/5 text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">{label}</span>
      <div className={cn(
        "h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-300",
        selected 
          ? "border-primary bg-primary text-primary-foreground scale-100" 
          : "border-border group-hover:border-primary/50 scale-90 group-hover:scale-100"
      )}>
        <Check className={cn(
          "h-3 w-3 transition-all duration-300",
          selected ? "opacity-100 scale-100" : "opacity-0 scale-50"
        )} />
      </div>
    </button>
  );
}
