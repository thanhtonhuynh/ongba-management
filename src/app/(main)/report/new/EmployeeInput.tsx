"use client";

import { ProfilePicture } from "@/components/ProfilePicture";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User } from "@/lib/auth/session";
import { CreateReportSchemaInput } from "@/lib/validations/report";
import { SaleEmployee } from "@/types";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

type EmployeeInputProps = {
  users: User[];
  employees: SaleEmployee[];
  formSetValue: UseFormSetValue<CreateReportSchemaInput>;
};

export function EmployeeInput({
  users,
  employees,
  formSetValue,
}: EmployeeInputProps) {
  const [userId, setUserId] = useState<string>();
  const [fullDay, setFullDay] = useState<boolean>(false);

  function addEmployee() {
    if (!userId) return;
    if (employees.some((employee) => employee.userId === userId)) {
      toast.error("Employee already added");
      return;
    }

    const employee = users.find((user) => user.id === userId);

    formSetValue("employees", [
      ...employees,
      {
        userId,
        fullDay,
        name: employee?.name || "",
        image: employee?.image || undefined,
      },
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <Select onValueChange={(value) => setUserId(value)}>
          <SelectTrigger className="h-12 flex-1">
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>

          <SelectContent>
            {users.map((user) => (
              <SelectItem
                key={user.id}
                value={user.id}
                className="cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  {user.image && (
                    <ProfilePicture image={user.image} size={30} />
                  )}
                  <span>{user.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Checkbox
            name="full-day"
            id="full-day"
            onClick={() => setFullDay(!fullDay)}
          />
          <Label htmlFor="full-day" className="cursor-pointer font-semibold">
            Full day
          </Label>
        </div>
        <Button type="button" variant={`outline`} onClick={addEmployee}>
          Add
        </Button>
      </div>

      {employees.length > 0 && (
        <div className="rounded-md border bg-muted p-4 sm:mx-auto sm:w-fit">
          {employees.map((employee, index) => (
            <div key={index}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center space-x-2">
                  {employee.image && (
                    <ProfilePicture image={employee.image} size={30} />
                  )}

                  <p className="font-semibold">{employee.name}</p>
                </div>

                <div className="flex items-center gap-4">
                  <p>{employee.fullDay ? "Full day" : "Half day"}</p>

                  <Button
                    className="p-0 text-muted-foreground hover:text-primary"
                    type="button"
                    variant={"link"}
                    onClick={() =>
                      formSetValue(
                        "employees",
                        employees.filter((_, i) => i !== index),
                      )
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>

              <Separator />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
