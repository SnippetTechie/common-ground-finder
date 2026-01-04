import { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtext: string;
  detail?: string;
}

export function MetricCard({ icon, label, value, subtext, detail }: MetricCardProps) {
  return (
    <div className="group p-5 rounded-xl border border-border bg-card transition-all duration-500 hover:border-primary/20 hover:shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-lg bg-accent/50 flex items-center justify-center text-muted-foreground transition-all duration-300 group-hover:bg-accent group-hover:text-primary group-hover:scale-110">
          {icon}
        </div>
        <span className="label-uppercase text-muted-foreground">{label}</span>
      </div>
      
      <div className="mb-2">
        <span className="font-serif text-4xl transition-all duration-300 group-hover:text-primary">{value}</span>
        <span className="text-muted-foreground ml-1">{subtext}</span>
      </div>

      <div className="pt-3 border-t border-border space-y-1">
        <p className="text-sm text-muted-foreground">{detail}</p>
        {detail && (
          <p className="text-sm text-primary italic font-serif">Most equitable location.</p>
        )}
      </div>
    </div>
  );
}
