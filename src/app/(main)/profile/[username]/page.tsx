import { Container } from "@/components/Container";
import { Header } from "@/components/header";
import { getUserByUsername } from "@/data-access/user";
import { getCurrentSession } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { notFound, redirect } from "next/navigation";
import { Fragment } from "react";
import { ProfileInfo } from "./_components/profile-info";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { user: currentUser } = await getCurrentSession();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.accountStatus !== "active") {
    return notFound();
  }

  const { username } = await params;
  const profileUser = await getUserByUsername(username);

  if (!profileUser) {
    return notFound();
  }

  // Non-admins and non-managers can only view users with "active" status
  const canViewAllStatuses = hasAccess(
    currentUser.role,
    "/employees",
    "update",
  );
  if (!canViewAllStatuses && profileUser.accountStatus !== "active") {
    return notFound();
  }

  const isOwner = currentUser.username === profileUser.username;

  return (
    <Fragment>
      <Header>
        <h1>Profile</h1>
      </Header>

      <Container>
        <ProfileInfo user={profileUser} isOwner={isOwner} />
      </Container>
    </Fragment>
  );
}
