import supabase from "../db/supabase.js";

export const registerUser = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { data, error } = await supabase.from("profiles").insert({
      id: user_id,
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, user: data });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
export const registerDoctor = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { name } = req.body;
    const { data, error } = await supabase.from("doctors").insert({
      id: user_id,
      name: name,
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, user: data });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, user: data });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
