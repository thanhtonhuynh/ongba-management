"use client";

import { ProfilePicture } from "@/components/ProfilePicture";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/lib/auth/session";
import { CreateReportSchemaInput } from "@/lib/validations/report";
import { SaleEmployee } from "@/types";
import { Dot } from "lucide-react";
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
  const [hour, setHour] = useState<number>(0.0);

  function addEmployee() {
    if (!userId) return;
    if (employees.some((employee) => employee.userId === userId)) {
      toast.error("Employee already added");
      return;
    }
    if (hour <= 0) {
      toast.error("Invalid hour");
      return;
    }

    const employee = users.find((user) => user.id === userId);

    formSetValue("employees", [
      ...employees,
      {
        userId,
        hour,
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

        <Input
          className="h-12 w-20"
          id="emp-hour"
          type="number"
          placeholder="0.00"
          value={hour}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setHour(Number(e.target.value))}
        />

        <Button type="button" onClick={addEmployee}>
          Add
        </Button>
      </div>

      {employees.length > 0 && (
        <ul className="space-y-1 lg:mx-auto lg:w-1/2">
          {employees.map((employee, index) => (
            <li
              key={index}
              className="flex h-12 items-center justify-between space-x-2 rounded px-2 text-sm shadow"
            >
              <div className="flex items-center space-x-2">
                {employee.image && (
                  <ProfilePicture image={employee.image} size={30} />
                )}
                <span>{employee.name}</span>
              </div>

              <div className="flex items-center">
                <p>
                  {employee.hour}
                  {employee.hour === 1 ? " hour" : " hours"}
                </p>

                <Dot size={15} />

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
