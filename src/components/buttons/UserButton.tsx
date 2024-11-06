import { Lock, LogOut, Settings, UserRound, Users } from "lucide-react";
import Link from "next/link";
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
import { logoutAction } from "@/app/(auth)/actions";
import { hasAccess } from "@/utils/access-control";
import { ProfilePicture } from "@/components/ProfilePicture";
import { ModeToggle } from "@/components/ModeToggle";

interface UserButtonProps {
  user: User;
}

export default function UserButton({ user }: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="flex-none rounded-full border bg-background text-primary shadow-md hover:bg-muted hover:ring-1 hover:ring-border"
        >
          {user.image ? (
            <ProfilePicture image={user.image} size={50} />
          ) : (
            <UserRound size={20} />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="space-y-1">
          <div>{user.name}</div>
          <div className="text-xs capitalize text-muted-foreground">
            {user.role}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {user.accountStatus === "active" && (
          <>
            <DropdownMenuGroup>
              {hasAccess(user.role, "/admin") && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="cursor-pointer">
                    <Lock className="mr-2 h-4 w-4" />
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link href="/employees" className="cursor-pointer">
                  <Users className="mr-2 h-4 w-4" />
                  Employees
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account settings</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuGroup className="sm:hidden">
          <DropdownMenuItem asChild>
            <ModeToggle />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="sm:hidden" />

        <DropdownMenuItem asChild>
          <form action={logoutAction}>
            <button type="submit" className="flex w-full items-center">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
