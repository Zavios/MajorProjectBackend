import supabase from "../db/supabase.js";

export const authenticate = async (req, res, next) => {
  try {
    console.log("auth middleware");
    const authHeader = req.headers.authorization;
    console.log("header", authHeader);
    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log("invalid user");
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }

    req.user = user;
    req.user_id = user.id;
    console.log(req.user_id);
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

export const authorizedDoctor = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = data.user;
    req.user_id = data.user.id;
    req.access_token = data.session.access_token;
    req.refresh_token = data.session.refresh_token;
    console.log(req.access_token);
    console.log(req.refresh_token);
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const authDocId = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", user_id);
    if (error || !data) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
