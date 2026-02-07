import { logoutAction } from "@/app/(auth)/actions";
import { ProfilePicture } from "@/components/ProfilePicture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/lib/auth/session";
import { hasAccess } from "@/utils/access-control";
import { Lock, LogOut, Settings, UserRound, Users } from "lucide-react";
import Link from "next/link";

interface UserButtonProps {
  user: User;
}

export default function UserButton({ user }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            size="icon"
            className="bg-background text-primary hover:bg-muted hover:ring-border flex-none rounded-full border shadow-md hover:ring-1"
          >
            {user.image ? (
              <ProfilePicture image={user.image} size={50} />
            ) : (
              <UserRound size={20} />
            )}
          </Button>
        }
      />

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="space-y-1">
          <div>{user.name}</div>
          <div className="text-muted-foreground text-xs capitalize">
            {user.role}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {user.accountStatus === "active" && (
          <>
            <DropdownMenuGroup>
              {hasAccess(user.role, "/admin") && (
                <DropdownMenuItem
                  render={
                    <Link href="/admin" className="cursor-pointer">
                      <Lock className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  }
                />
              )}

              <DropdownMenuItem
                render={
                  <Link href="/employees" className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    Employees
                  </Link>
                }
              />

              <DropdownMenuItem
                render={
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account settings</span>
                  </Link>
                }
              />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuSeparator className="sm:hidden" />

        <DropdownMenuItem
          render={
            <form action={logoutAction}>
              <button type="submit" className="flex w-full items-center">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </button>
            </form>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
