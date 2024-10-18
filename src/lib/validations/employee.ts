import { z } from "zod";

const trimmedString = z.string().trim();
const requiredString = trimmedString.min(1, "Required");

// Update employee role
export const UpdateEmployeeRoleSchema = z.object({
  userId: requiredString,
  role: requiredString.toLowerCase(),
});
export type UpdateEmployeeRoleInput = z.infer<typeof UpdateEmployeeRoleSchema>;
