"use client";

import { ProfilePicture } from "@/components/shared/profile-picture";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { AtIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type Props = {
  users: User[];
  selectedUserId: string;
  selectedUserIds: string[];
  onSelect: (user: User) => void;
};

export function EmployeeCombobox({ users, selectedUserId, selectedUserIds, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-9 w-full justify-between font-normal",
              !selectedUserId && "text-muted-foreground",
            )}
          >
            {selectedUser ? (
              <div className="flex items-center gap-2">
                <ProfilePicture image={selectedUser.image} name={selectedUser.name} size={25} />
                <div className="flex flex-col items-start text-xs tracking-tight">
                  <span className="font-medium">{selectedUser.name}</span>
                  <span className="text-muted-foreground flex items-center gap-0.5">
                    <HugeiconsIcon icon={AtIcon} className="size-3" />
                    {selectedUser.username}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">Select employee...</span>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        }
      />

      <PopoverContent className="w-(--anchor-width) border border-gray-400 p-0 shadow-lg">
        <Command className="space-y-1.5">
          <CommandInput placeholder="Search by name or username..." />

          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>

            <CommandGroup>
              {users.map((user, i) => {
                const alreadySelected =
                  selectedUserIds.includes(user.id) && user.id !== selectedUserId;
                return (
                  <div key={user.id}>
                    <CommandItem
                      value={`${user.name} ${user.username}`}
                      disabled={alreadySelected}
                      onSelect={() => {
                        if (alreadySelected) return;
                        onSelect(user);
                        setOpen(false);
                      }}
                      className="mb-1 py-0.5"
                    >
                      <ProfilePicture name={user.name} image={user.image} size={25} />
                      <div className="flex flex-1 items-center justify-between gap-1">
                        <div className="text-xs">
                          <span className="font-medium">{user.name}</span>
                          <span className="text-muted-foreground flex items-center gap-0.5">
                            <HugeiconsIcon icon={AtIcon} className="size-3" />
                            {user.username}
                          </span>
                        </div>

                        <CommandShortcut
                          className={cn(selectedUserId === user.id ? "opacity-100" : "opacity-0")}
                        >
                          <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                        </CommandShortcut>
                      </div>
                    </CommandItem>
                  </div>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
