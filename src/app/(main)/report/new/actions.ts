"use server";

import { createReport } from "@/data/report";
import { getCurrentSession } from "@/lib/auth/session";
import {
  CreateReportSchema,
  CreateReportSchemaTypes,
} from "@/lib/report/validation";

export async function createReportAction(data: CreateReportSchemaTypes) {
  try {
    const { user } = await getCurrentSession();
    if (!user || !user.userVerified) {
      return { error: "Unauthorized." };
    }

    const parsedData = CreateReportSchema.parse(data);

    await createReport(parsedData, user.id);

    return {};
  } catch (error) {
    console.error(error);
    return { error: "Report creation failed. Please try again." };
  }
}
