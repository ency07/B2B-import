import { Spinner } from "@/components/ui/spinner";

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 border border-border rounded-lg bg-card/30">
      <Spinner className="text-muted-foreground mb-2 w-6 h-6" />
      <span className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground font-bold">
        {message}
      </span>
    </div>
  );
}
