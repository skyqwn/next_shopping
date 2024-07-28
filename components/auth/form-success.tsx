import { CheckCircle2 } from "lucide-react";

const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 text-white text-xs font-medium bg-teal-400 my-4 text-secondary-foreground p-3 rounded-md">
      <CheckCircle2 className="4" />
      <p>{message}</p>
    </div>
  );
};

export default FormSuccess;
