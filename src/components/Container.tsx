import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={cn(`mx-auto max-w-6xl p-2 sm:px-4`, className)}>
      {children}
    </main>
  );
}
