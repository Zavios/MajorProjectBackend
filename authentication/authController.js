import supabase from "../db/supabase.js";

export const registerUser = async (req, res) => {
  try {
    const { username, dob, gender, email, password } = req.body;
    const { data: user, error: userError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(user);
    const user_id = user.user.id;
    console.log(user_id);
    if (userError) {
      return res.status(400).json({ success: false, error: userError.message });
    }
    const { data, error } = await supabase.from("profiles").insert({
      id: user_id,
      username: username,
      dob: new Date(dob),
      gender: gender,
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
    const { data: username, error: usernameError } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .single();
    console.log(username);
    if (usernameError) {
      console.log("er");
    }
    return res.status(200).json({
      success: true,
      user: {
        user_id: data.user.id,
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        },
      },
    });
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

export const refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refresh_token,
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
      refreshToken: data.refresh_token,
      accessToken: data.access_token,
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
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
    return res.status(200).json({ success: true, user: user });
  } catch (error) {
    console.error("Error verifying user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

const initialSetup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "signup",
      email: email,
    });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
