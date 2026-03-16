import supabase from "../db/supabase.js";

export const getDoctor = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", user_id);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor fetched successfully",
      doctor: data,
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getPendingChats = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("is_approved", false);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      message: "Pending chats fetched successfully",
      chats: data,
    });
  } catch (error) {
    console.error("Error fetching pending chats:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
