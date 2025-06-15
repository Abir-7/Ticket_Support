import { z } from "zod";

export const productZodSchema = z.object({
  body: z
    .object({
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
      model: z.string().min(1, { message: "Model is required" }).optional(),
      description: z
        .string()
        .min(1, { message: "Description is required" })
        .optional(),
    })
    .strict(),
});
