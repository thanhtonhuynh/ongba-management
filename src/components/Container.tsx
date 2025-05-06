import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn(`flex flex-col gap-8 p-4 pb-8 md:p-8`, className)}>
      {children}
    </main>
  );
}
