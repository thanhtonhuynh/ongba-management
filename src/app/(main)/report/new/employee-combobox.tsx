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
            "h-9 w-full justify-between font-normal",
            !selectedUserId && "text-muted-foreground",
          )}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              {selectedUser.image && (
                <ProfilePicture image={selectedUser.image} size={25} />
              )}
              <div className="flex flex-col items-start text-xs tracking-tight">
                <span className="font-medium">{selectedUser.name}</span>
                <span className="text-muted-foreground">
                  &lt;{selectedUser.email}&gt;
                </span>
              </div>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">
              Select employee...
            </span>
          )}
          <ChevronsUpDown className="opacity-50" />
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
                      className="py-0.5"
                    >
                      {user.image && (
                        <ProfilePicture image={user.image} size={25} />
                      )}
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-muted-foreground">
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
