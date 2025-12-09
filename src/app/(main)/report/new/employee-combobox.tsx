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
            "w-full justify-between font-normal",
            !selectedUserId && "text-muted-foreground",
          )}
        >
          {selectedUser ? (
            <div className="flex items-center gap-2">
              {selectedUser.image && (
                <ProfilePicture image={selectedUser.image} size={30} />
              )}
              <span>{selectedUser.name}</span>
              <span className="text-muted-foreground ml-1 text-xs">
                &lt;{selectedUser.email}&gt;
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select employee...</span>
          )}
          <ChevronsUpDown className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search by name or email..." />

          <CommandList>
            <CommandEmpty>No employees found.</CommandEmpty>

            <CommandGroup>
              {users.map((user) => {
                const alreadySelected =
                  selectedUserIds.includes(user.id) &&
                  user.id !== selectedUserId;
                return (
                  <CommandItem
                    key={user.id}
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
                    <span>{user.name}</span>
                    <span className="text-muted-foreground ml-1 text-xs">
                      {user.email}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedUserId === user.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
