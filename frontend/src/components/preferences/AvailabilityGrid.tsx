import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X, Clock } from "lucide-react";

export interface TimeRangeSlot {
  selected: boolean;
  from: string;
  to: string;
}

interface AvailabilityGridProps {
  availability: Record<string, TimeRangeSlot>;
  onChange: (day: string, field: keyof TimeRangeSlot, value: any) => void;
  onBulkChange?: (newAvailability: Record<string, TimeRangeSlot>) => void;
}

const DAYS = [
  { id: "MON", label: "Mon" },
  { id: "TUE", label: "Tue" },
  { id: "WED", label: "Wed" },
  { id: "THU", label: "Thu" },
  { id: "FRI", label: "Fri" },
  { id: "SAT", label: "Sat" },
  { id: "SUN", label: "Sun" },
];

export function AvailabilityGrid({ availability, onChange, onBulkChange }: AvailabilityGridProps) {
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const handleQuickSelect = (type: "weekdays" | "weekends" | "all" | "reset") => {
    if (!onBulkChange) return;

    if (type === "reset") {
      const newAvailability = { ...availability };
      Object.keys(newAvailability).forEach(key => {
        newAvailability[key] = { ...newAvailability[key], selected: false };
      });
      onBulkChange(newAvailability);
      return;
    }

    const daysToSelect = type === "weekdays"
      ? ["MON", "TUE", "WED", "THU", "FRI"]
      : type === "weekends"
        ? ["SAT", "SUN"]
        : ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    const newAvailability = { ...availability };

    // Better UX: Reset others so it's a "preset".
    Object.keys(newAvailability).forEach(key => {
      newAvailability[key] = { ...newAvailability[key], selected: false };
    });

    daysToSelect.forEach(day => {
      newAvailability[day] = { ...newAvailability[day], selected: true };
    });

    onBulkChange(newAvailability);
  };

  return (
    <div className="space-y-4">
      {/* Quick Selects */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Days</label>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleQuickSelect("weekdays")} className="h-6 text-[10px] px-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
            Weekdays
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleQuickSelect("weekends")} className="h-6 text-[10px] px-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
            Weekends
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleQuickSelect("all")} className="h-6 text-[10px] px-2 text-muted-foreground hover:text-primary hover:bg-primary/10">
            All Days
          </Button>
          <div className="w-px h-3 bg-border mx-1 self-center" />
          <Button variant="ghost" size="sm" onClick={() => handleQuickSelect("reset")} className="h-6 text-[10px] px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
            Reset
          </Button>
        </div>
      </div>

      {/* Horizontal Day Selector */}
      <div className="grid grid-cols-7 gap-1 md:gap-3">
        {DAYS.map((day) => {
          const isSelected = availability[day.id]?.selected;
          const isActive = activeDay === day.id;

          return (
            <button
              key={day.id}
              type="button"
              onClick={() => setActiveDay(isActive ? null : day.id)}
              className={cn(
                "flex flex-col items-center justify-center py-2 md:py-3 rounded-lg border transition-all duration-200 text-xs md:text-sm font-medium relative focus:outline-none focus:ring-2 focus:ring-primary/20",
                isActive
                  ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                  : isSelected
                    ? "border-primary/40 bg-card text-foreground hover:border-primary/60"
                    : "border-border/50 bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              <span>{day.label}</span>
              <div className={cn(
                "h-1 w-1 rounded-full mt-1 transition-all",
                isSelected ? "bg-primary" : "bg-transparent"
              )} />
            </button>
          );
        })}
      </div>

      {/* Inline Editor Panel */}
      {activeDay && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200 border border-border rounded-lg bg-card/50 p-4 relative mt-2">
          <button
            onClick={() => setActiveDay(null)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted text-muted-foreground z-10"
          >
            <X className="h-3 w-3" />
          </button>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">
                    {DAYS.find(d => d.id === activeDay)?.label} Availability
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {availability[activeDay]?.selected ? "Available" : "Unavailable"}
                </span>
                <Switch
                  checked={availability[activeDay]?.selected}
                  onCheckedChange={(checked) => onChange(activeDay, 'selected', checked)}
                />
              </div>
            </div>

            {availability[activeDay]?.selected && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">Start Time</label>
                  <Input
                    type="time"
                    value={availability[activeDay]?.from || ""}
                    onChange={(e) => onChange(activeDay, 'from', e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider ml-1">End Time</label>
                  <Input
                    type="time"
                    value={availability[activeDay]?.to || ""}
                    onChange={(e) => onChange(activeDay, 'to', e.target.value)}
                    className="h-9 bg-background"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => setActiveDay(null)}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
