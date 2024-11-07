import NavBar from "@/components/NavBar";
import { CircleAlert } from "lucide-react";

export default async function NotFound() {
  return (
    <>
      <NavBar />
      <main className="flex h-[80vh] items-center justify-center">
        <div className="flex items-center justify-center gap-4 rounded-lg border border-destructive px-6 py-8 text-destructive shadow-lg">
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
