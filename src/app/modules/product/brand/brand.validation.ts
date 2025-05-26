import { z } from "zod";

export const brandZodSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, "Brand name is required"),

      description: z.string().min(1, "Description is required").optional(),
    })
    .strict(),
});

export type BrandInput = z.infer<typeof brandZodSchema>;
