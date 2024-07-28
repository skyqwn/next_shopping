import { AlertCircle } from "lucide-react";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="bg-destructive/40 flex gap-2 items-center justify-center text-secondary-foreground p-3 rounded-md">
      <AlertCircle className="size-4" />
      <p>{message}</p>
    </div>
  );
};

export default FormError;
