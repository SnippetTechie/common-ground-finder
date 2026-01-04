import { ReactNode } from "react";

interface ValueCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="group p-6 rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/20 hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 h-12 w-12 rounded-xl bg-accent/50 flex items-center justify-center text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:shadow-md">
        {icon}
      </div>
      <h3 className="font-serif text-xl mb-2 transition-colors duration-300 group-hover:text-primary">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  );
}
