import { TrendingUp, TrendingDown } from "lucide-react";

interface AlternativeCardProps {
  option: string;
  score: number;
  title: string;
  datetime: string;
  venue: string;
  pros: string[];
  cons: string[];
  tradeoffLabel?: string;
}

export function AlternativeCard({
  option,
  score,
  title,
  datetime,
  venue,
  pros,
  cons,
  tradeoffLabel
}: AlternativeCardProps) {
  return (
    <div className="group p-5 rounded-xl border border-border bg-card transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start justify-between mb-3">
        <span className="px-2.5 py-1 rounded-full border border-border text-xs font-medium text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:bg-accent/30">
          {option}
        </span>
        <div className="flex flex-col items-end">
          {tradeoffLabel && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80 mb-2 px-2 py-0.5 rounded-full bg-muted/60">
              {tradeoffLabel}
            </span>
          )}
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Fairness Score</span>
          <span className="font-serif text-3xl font-medium transition-transform duration-300 group-hover:scale-110">{score}</span>
          <span className="text-xs font-medium mt-0.5 text-primary">
            {score >= 90 ? "Excellent" : score >= 80 ? "Very Good" : score >= 70 ? "Good" : "Average"}
          </span>
        </div>
      </div>

      <h4 className="font-serif text-xl mb-1 transition-colors duration-300 group-hover:text-primary">{title}</h4>
      <p className="text-sm text-muted-foreground mb-4">
        {datetime} • {venue}
      </p>

      <div className="space-y-2 pt-3 border-t border-border">
        {pros.map((pro, i) => (
          <div key={i} className="flex items-center gap-2 text-sm group/item">
            <TrendingUp className="h-3.5 w-3.5 text-success transition-transform duration-300 group-hover/item:scale-110" />
            <span className="transition-colors duration-300 group-hover/item:text-foreground">{pro}</span>
          </div>
        ))}
        {cons.map((con, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-destructive group/item">
            <TrendingDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover/item:scale-110" />
            <span className="transition-colors duration-300">{con}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
