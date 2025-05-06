import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { getCurrentSession } from "@/lib/auth/session";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { UpdateAvatar } from "./UpdateAvatar";
import { UpdateEmailForm } from "./UpdateEmailForm";
import { UpdateNameForm } from "./UpdateNameForm";
import { UpdatePasswordForm } from "./UpdatePasswordForm";
import { UpdateUsernameForm } from "./UpdateUsernameForm";

export default async function Page() {
  const { session, user } = await getCurrentSession();
  if (!session) redirect("/login");
  if (user.accountStatus !== "active") return notFound();

  return (
    <Fragment>
      <Header>
        <h1>Account settings</h1>
      </Header>

      <Container>
        <UpdateAvatar user={user} />
        <UpdateNameForm user={user} />
        <UpdateUsernameForm user={user} />
        <UpdateEmailForm user={user} />
        <UpdatePasswordForm />
      </Container>
    </Fragment>
  );
}
