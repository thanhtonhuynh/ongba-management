import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        `m-4 mx-auto flex flex-col p-4 md:max-w-[60rem] lg:max-w-[72rem]`,
        className,
      )}
    >
      {children}
    </main>
  );
}
