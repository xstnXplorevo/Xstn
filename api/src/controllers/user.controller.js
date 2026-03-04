import TryCatch from "../middleware/TryCatch.js";
import {
  developerFormSchema,
  projectFormSchema,
} from "../utility/zodSchema.js";
import supabase from "../config/supabaseSetup.js";

export const developerForm = TryCatch(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "UserId not found" });

  if (!req.file) return res.status(400).json({ message: "No resume uploaded" });

  const parsedBody = {
    ...req.body,
    tech_stack: req.body.tech_stack?.split(",").map((s) => s.trim()),
  };

  const validation = developerFormSchema.safeParse(parsedBody);
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: validation.error.flatten(),
    });
  }

  const { name, email, github_url, linkedin_url, tech_stack } = validation.data;

  const fileName = `${userId}/resume.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(fileName, req.file.buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError)
    return res.status(500).json({ message: uploadError.message });

  const { data } = supabase.storage.from("resumes").getPublicUrl(fileName);

  const { error: dbError } = await supabase
    .from("developer_applications")
    .upsert(
      {
        user_id: userId,
        name,
        email,
        github_url,
        linkedin_url,
        tech_stack,
        resume_url: data.publicUrl,
      },
      { onConflict: "user_id" },
    );

  if (dbError) return res.status(500).json({ message: dbError.message });

  return res
    .status(201)
    .json({ message: "Application submitted successfully" });
});

export const projectForm = TryCatch(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "UserId not found" });

  const parsedBody = {
    ...req.body,
    tech_stack: req.body.tech_stack?.split(",").map((s) => s.trim()),
    deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
  };

  const validation = projectFormSchema.safeParse(parsedBody);
  if (!validation.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: validation.error.flatten(),
    });
  }

  const { name, description, tech_stack, deadline } = validation.data;

  const { error: dbError } = await supabase.from("projectapplications").insert({
    user_id: userId,
    name,
    description,
    tech_stack,
    deadline: deadline.toISOString(),
    status: "submitted",
  });

  if (dbError) return res.status(500).json({ message: dbError.message });

  return res.status(201).json({ message: "Project submitted successfully" });
});
