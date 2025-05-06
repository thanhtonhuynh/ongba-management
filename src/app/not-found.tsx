import { CircleAlert } from "lucide-react";

export default async function NotFound() {
  return (
    <>
      <main className="flex h-[80vh] items-center justify-center">
        <div className="border-destructive text-destructive flex items-center justify-center gap-4 rounded-lg border px-6 py-8 shadow-lg">
          <CircleAlert size={32} />

          <div className="flex flex-col gap-4">
            <h1>Access Denied!</h1>
            <div>
              The resource you are trying to access is restricted or not
              available at the moment.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
