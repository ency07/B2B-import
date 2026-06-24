interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;
  return (
    <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive font-mono">
      {message}
    </div>
  );
}
