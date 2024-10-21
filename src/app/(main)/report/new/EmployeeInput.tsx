"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/auth/session";
import { CreateReportSchemaInput } from "@/lib/report/validation";
import { SaleEmployee } from "@/types";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

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
    if (employees.some((employee) => employee.userId === userId)) return;

    const employeeName = users.find((user) => user.id === userId)?.name || "";

    formSetValue("employees", [
      ...employees,
      { userId, fullDay, name: employeeName },
    ]);
  }

  return (
    <div className="flex items-center space-x-4">
      <Select onValueChange={(value) => setUserId(value)}>
        <SelectTrigger className="w-1/2">
          <SelectValue placeholder="Select employee" />
        </SelectTrigger>

        <SelectContent>
          {users.map((user) => (
            <SelectItem
              key={user.id}
              value={user.id}
              className="cursor-pointer"
            >
              {user.name}
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
  );
}
