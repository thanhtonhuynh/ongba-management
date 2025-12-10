"use client";

import { ProfilePicture } from "@/components/ProfilePicture";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

type Props = {
  users: User[];
  selectedUserId: string;
  selectedUserIds: string[];
  onSelect: (user: User) => void;
};

export function EmployeeCombobox({
  users,
  selectedUserId,
  selectedUserIds,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedUser = users.find((user) => user.id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 w-full justify-between font-normal",
            !selectedUserId && "text-muted-foreground",
          )}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              {selectedUser.image && (
                <ProfilePicture image={selectedUser.image} size={30} />
              )}
              <div className="flex flex-col items-start">
                <span>{selectedUser.name}</span>
                <span className="text-muted-foreground text-xs">
                  &lt;{selectedUser.email}&gt;
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground">Select employee...</span>
          )}
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="border border-gray-400 p-0 shadow-lg">
        <Command>
          <CommandInput placeholder="Search by name or email..." />

          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>

            <CommandGroup className="">
              {users.map((user, i) => {
                const alreadySelected =
                  selectedUserIds.includes(user.id) &&
                  user.id !== selectedUserId;
                return (
                  <div key={user.id}>
                    <CommandItem
                      value={`${user.name} ${user.email}`}
                      disabled={alreadySelected}
                      onSelect={() => {
                        if (alreadySelected) return;
                        onSelect(user);
                        setOpen(false);
                      }}
                    >
                      {user.image && (
                        <ProfilePicture image={user.image} size={30} />
                      )}
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <span className="text-muted-foreground text-xs">
                          {user.email}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto",
                          selectedUserId === user.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>

                    {i < users.length - 1 && <Separator className="my-1" />}
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
