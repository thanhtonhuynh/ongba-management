import { Container } from "@/components/Container";
import { getCurrentSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (!user.userVerified) redirect("/user-not-verify");

  return (
    <Container className="space-y-4">
      <div>Good day, {user.name}!</div>
      <div>
        Today is{" "}
        <span className="font-bold">
          {moment().format("dddd, MMM DD, YYYY")}
        </span>
      </div>

      <Button className="w-fit" asChild>
        <Link href={`report/new`}>Create new sale report</Link>
      </Button>
    </Container>
  );
}
