import { v4 as uuidv4 } from "uuid";
import supabase from "../db/supabase.js";

export const uploadXrayImage = async (req, res) => {
  try {
    const user_id = req.user_id;

    if (!req.file) {
      console.log("No image file provided");
      return res.status(400).json({
        success: false,
        message: "No image file provided",
      });
    }

    console.log("Uploaded file:", req.file); // ✅ correct way to log the file

    const xrayId = uuidv4();
    const filePath = `${user_id}/${xrayId}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) {
      console.log("Image upload failed", uploadError);
      return res.status(400).json({
        success: false,
        message: "Image upload failed",
        error: uploadError.message,
      });
    }

    console.log("test 1");
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    console.log("test 2");

    const response = await fetch("http://localhost:8000/predict-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageURL: publicUrlData.publicUrl }),
    });
    console.log("response", response);
    if (response.status !== 200) {
      return res.status(400).json({
        success: false,
        message: "Prediction failed",
        error: response.error,
      });
    }
    const prediction = await response.json();
    console.log(prediction);

    // ✅ Build chatData here instead of mutating an undefined variable
    const chatData = {
      user_id: user_id,
      image_url: publicUrlData.publicUrl,
      confidence_score: prediction.confidenceScore,
      prediction: prediction.prediction,
    };

    const { data, error } = await supabase
      .from("chats")
      .insert(chatData)
      .select();

    if (error) {
      console.log("Chat upload failed", error);
      return res.status(400).json({
        success: false,
        message: "Chat upload failed",
        error: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: data,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const getChatHistory = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

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

export const editTitle = async (req, res) => {
  try {
    const { chat_id, title } = req.body;
    const { data, error } = await supabase
      .from("chats")
      .update({ title: title })
      .eq("id", chat_id);
    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      chat: data,
      message: "Title updated successfully",
    });
  } catch (error) {
    console.error("Error updating title:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { chat_id } = req.params;
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("id", chat_id)
      .single();
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log(data);
    return res.status(200).json({
      success: true,
      chat: data,
      message: "Chat fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const editPatientNote = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { chat_id, note } = req.body;
    if (user_id !== chat_id) {
      return res.status(400).json({ success: false, error: "Unauthorized" });
    }
    const { data, error } = await supabase
      .from("chats")
      .update({ patient_note: note })
      .eq("id", chat_id)
      .eq("user_id", user_id)
      .select();

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
    return res.status(200).json({
      success: true,
      chat: data,
      message: "Note updated successfully",
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
