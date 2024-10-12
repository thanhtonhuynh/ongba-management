import { cn } from '@/lib/utils';
import { Check, CircleAlert } from 'lucide-react';

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
        `text-white bg-destructive rounded p-2 flex items-center gap-2 text-sm`,
        className
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
        ` bg-green-700 text-white rounded p-2 text-sm flex items-center gap-2`,
        className
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
