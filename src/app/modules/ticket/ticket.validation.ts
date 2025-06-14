// Add Zod or Joi validation schema here if needed for ticket endpoints
import { z } from "zod";

export const ticketZodSchema = z.object({
  body: z
    .object({
      productId: z.string(),
      phone: z.string(),
      issue: z
        .array(z.string().min(1, "Each issue must be at least 1 character"))
        .nonempty("Issue is required"),
      userType: z.enum(["Applicator", "Distributor"], {
        errorMap: () => ({
          message: "userType must be one of Customer, Admin, or Support",
        }),
      }),
      description: z.string().optional(),
      note: z.string().optional(),
      distributor: z.string().optional(),
      productSerialNumber: z.string(),
    })
    .strict(),
});
