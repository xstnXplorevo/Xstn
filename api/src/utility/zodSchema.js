import { z } from "zod";

export const developerFormSchema = z.object({
  name: z.string().min("2").max("120"),
  email: z.email("Please enter a valid email"),
  github_url: z.url(),
  linkdein_url: z.url(),
  tech_stack: z.array(z.string()).min(1).max("50"),
});
