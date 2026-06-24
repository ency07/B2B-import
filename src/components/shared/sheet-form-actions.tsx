import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface SheetFormActionsProps {
  submitting: boolean;
  onCancel: () => void;
  submitLabel: string;
}

export function SheetFormActions({ submitting, onCancel, submitLabel }: SheetFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t border-border mt-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={submitting}
        className="border-border text-foreground text-xs hover:bg-accent cursor-pointer bg-card"
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        disabled={submitting}
        className="bg-primary hover:bg-primary/95 text-primary-foreground text-xs cursor-pointer px-4"
      >
        {submitting ? <Spinner size="sm" className="mr-2 text-primary-foreground" /> : null}
        {submitLabel}
      </Button>
    </div>
  );
}
