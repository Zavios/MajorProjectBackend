import { v4 as uuidv4 } from "uuid";
import supabase from "../db/supabase.js";

export const uploadXrayImage = async (req, res) => {
  try {
    const user_id = req.user_id;
    const chatData = req.body;
    const xrayId = uuidv4();
    const { image, error: uploadError } = await supabase.storage
      .from("xray")
      .upload(user_id + "/" + xrayId, req.image);
    if (uploadError) {
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: uploadError.message,
      });
    }
    chatData.xray_id = xrayId;
    const { data, error } = await supabase.from("chats").insert(chatData);
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: "Chat history fetched successfully",
      chats: data,
    });
  } catch (error) {
    console.error("Error getting chat history:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
