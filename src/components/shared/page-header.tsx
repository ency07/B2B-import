import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  moduleLabel: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function PageHeader({ moduleLabel, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-bold">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> {moduleLabel}
        </div>
        <h1 className="text-base font-mono uppercase tracking-widest font-bold text-foreground mt-1">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
