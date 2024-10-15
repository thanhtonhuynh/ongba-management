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
import { CreateReportSchemaTypes } from "@/lib/report/validation";
import { SaleEmployee } from "@/types";
import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

type EmployeeInputProps = {
  users: User[];
  employees: SaleEmployee[];
  formSetValue: UseFormSetValue<CreateReportSchemaTypes>;
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
    formSetValue("employees", [...employees, { userId, fullDay }]);
  }

  return (
    <div className="flex items-center space-x-4">
      <Select onValueChange={(value) => setUserId(value)}>
        <SelectTrigger className="w-1/2">
          <SelectValue placeholder="Select employee" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Employees</SelectLabel>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2">
        <Checkbox
          name="full-day"
          id="full-day"
          onClick={() => setFullDay(!fullDay)}
        />
        <Label htmlFor="full-day" className="font-semibold">
          Full day
        </Label>
      </div>

      <Button type="button" variant={`outline`} onClick={addEmployee}>
        Add employee
      </Button>
    </div>
  );
}
