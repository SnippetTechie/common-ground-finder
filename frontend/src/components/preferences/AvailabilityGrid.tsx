import { cn } from "@/lib/utils";

interface AvailabilityGridProps {
  availability: Record<string, { am: boolean; pm: boolean }>;
  onToggle: (day: string, period: "am" | "pm") => void;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI"];

export function AvailabilityGrid({ availability, onToggle }: AvailabilityGridProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-6 gap-2">
        <div /> {/* Empty cell for row labels */}
        {DAYS.map((day) => (
          <div key={day} className="text-center">
            <span className="label-uppercase text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>

      {/* AM Row */}
      <div className="grid grid-cols-6 gap-2">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">AM</span>
        </div>
        {DAYS.map((day, index) => (
          <button
            key={`${day}-am`}
            type="button"
            onClick={() => onToggle(day, "am")}
            style={{ animationDelay: `${index * 50}ms` }}
            className={cn(
              "h-11 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95",
              availability[day]?.am
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:shadow-md"
            )}
          >
            AM
          </button>
        ))}
      </div>

      {/* PM Row */}
      <div className="grid grid-cols-6 gap-2">
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground">PM</span>
        </div>
        {DAYS.map((day, index) => (
          <button
            key={`${day}-pm`}
            type="button"
            onClick={() => onToggle(day, "pm")}
            style={{ animationDelay: `${index * 50 + 100}ms` }}
            className={cn(
              "h-11 rounded-lg border text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95",
              availability[day]?.pm
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:shadow-md"
            )}
          >
            PM
          </button>
        ))}
      </div>
    </div>
  );
}
