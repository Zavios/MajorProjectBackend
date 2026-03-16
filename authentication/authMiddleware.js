import supabase from "../db/supabase";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const authorizedCreate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = data.user;
    req.user_id = data.user.id;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
