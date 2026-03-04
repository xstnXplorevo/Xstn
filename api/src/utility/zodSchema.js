import { z } from "zod";

export const developerFormSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.email("Please enter a valid email"),
  github_url: z.url(),
  linkedin_url: z.url(),
  tech_stack: z.array(z.string().min(2).max(100)).min(1).max(50),
});

export const projectFormSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(2).max(2000),
  tech_stack: z.array(z.string().min(2).max(50)).min(1).max(50),
  deadline: z.date(),
});
