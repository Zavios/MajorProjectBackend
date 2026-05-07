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
      .select(
        `
    id,
    created_at,
    image_url,
    patient_note,
    title,
    prediction,
    confidence_score,
    doctor_id,
    is_approved,
    time_approved,
    doctor_note,
    profiles (
      id,
      username,
      created_at,
      dob,
      gender
    )
  `,
      )
      .eq("is_approved", false)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    console.log(data);
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

export const addDoctorNote = async (req, res) => {
  try {
    const user_id = req.user_id;
    console.log("user_id", user_id);
    const { chat_id, note } = req.body;

    const { data, error } = await supabase
      .from("chats")
      .update({ doctor_note: note, is_approved: true, doctor_id: user_id })
      .eq("id", chat_id)
      .select("*")
      .single();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      chat: data,
      message: "Note added successfully",
    });
  } catch (error) {
    console.error("Error adding note:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getApprovedChats = async (req, res) => {
  try {
    const user_id = req.user_id;
    console.log("user_id", user_id);
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
    id,
    created_at,
    image_url,
    patient_note,
    title,
    prediction,
    confidence_score,
    doctor_id,
    is_approved,
    time_approved,
    doctor_note,
    profiles (
      id,
      username,
      created_at,
      dob,
      gender
    )
  `,
      )
      .eq("is_approved", true)
      .eq("doctor_id", user_id);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      message: "Approved chats fetched successfully",
      chats: data,
    });
  } catch (error) {
    console.error("Error fetching approved chats:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const requestRecord = async (req, res) => {
  try {
    const user_id = req.user_id;
    // const { chat_id } = req.body;
    const { data, error } = await supabase
      .from("chats")
      .select(
        `
    id,
    created_at,
    image_url,
    patient_note,
    title,
    prediction,
    confidence_score,
    doctor_id,
    is_approved,
    time_approved,
    doctor_note,
    profiles (
      id,
      username,
      created_at,
      dob,
      gender
    )
  `,
      )
      .eq("is_approved", false)
      .order("created_at", { ascending: false });
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    console.log(data);
    return res.status(200).json({
      success: true,
      chat: data,
      message: "Record requested successfully",
    });
  } catch (error) {
    console.error("Error requesting record:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { name } = req.body;
    const { data, error } = await supabase
      .from("doctors")
      .insert({ id: user_id, name: name })
      .select();
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      doctor: data,
      message: "Doctor created successfully",
    });
  } catch (error) {
    console.error("Error creating doctor:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const doctorLogin = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", user_id)
      .single();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      doctor: data,
      session: {
        access_token: req.access_token,
        refresh_token: req.refresh_token,
      },
      message: "Doctor fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
