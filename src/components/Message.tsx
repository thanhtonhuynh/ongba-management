import { cn } from "@/lib/utils";
import { Check, CircleAlert } from "lucide-react";

export function ErrorMessage({
  title,
  message,
  className,
}: {
  title?: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `flex items-center gap-2 rounded bg-destructive p-2 text-sm text-white`,
        className,
      )}
    >
      <CircleAlert size={20} />

      <div>
        <div className="font-bold">{title}</div>
        {message}
      </div>
    </div>
  );
}

export function SuccessMessage({
  title,
  message,
  className,
}: {
  title?: string;
  message: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        `flex items-center gap-2 rounded bg-green-500 p-2 text-sm text-white`,
        className,
      )}
    >
      <Check size={20} />

      <div>
        <div className="font-bold">{title}</div>
        {message}
      </div>
    </div>
  );
}
