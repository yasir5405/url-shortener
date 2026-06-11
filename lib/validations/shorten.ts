import z from "zod";

export const linkValidation = z.object({
  url: z.url({ error: "Please provide a valid URL." }),
});

export type LinkInput = z.infer<typeof linkValidation>;
