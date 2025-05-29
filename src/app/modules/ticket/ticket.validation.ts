// Add Zod or Joi validation schema here if needed for ticket endpoints
import { z } from "zod";

export const ticketZodSchema = z.object({
  body: z.object({
    phone: z.string(),

    issue: z.string().min(1, "Issue is required"),
    userType: z.enum(["Customer", "Admin", "Support"], {
      errorMap: () => ({
        message: "userType must be one of Customer, Admin, or Support",
      }),
    }),
    description: z.string().optional(),
  }),
});
