import { z } from "zod";

export const productZodSchema = z.object({
  body: z
    .object({
      brand: z
        .string()
        .length(24, { message: "Brand must be a 24-char hex string" }),
      model: z.string().min(1, { message: "Model is required" }),
      description: z
        .string()
        .min(1, { message: "Description is required" })
        .optional(),
    })
    .strict(),
});

export const productUpdateZodSchema = z.object({
  body: z
    .object({
      brand: z
        .string()
        .length(24, { message: "Brand must be a 24-char hex string" })
        .optional(),
      model: z.string().min(1, { message: "Model is required" }).optional(),
      description: z
        .string()
        .min(1, { message: "Description is required" })
        .optional(),
    })
    .strict(),
});
