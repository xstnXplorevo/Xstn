import supabase from "../config/supabaseSetup.js";

export const authenticateToken = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);
  if (error || !user) return res.sendStatus(403);

  req.user = user;
  next();
};
