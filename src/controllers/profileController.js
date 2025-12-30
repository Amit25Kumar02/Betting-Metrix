import User from "../models/User.js";
import fs from "fs";
import path from "path";

// update profile
export const updateProfile = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);

    const { userId, fullName, phone, countryCode } = req.body;
    if (!userId) {
      return res.status(400).json({ msg: "User ID missing" });
    }

    let updateData = { fullName, phone, countryCode };

    if (req.file) {
      updateData.profileImage = `/uploads/profile/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.json({ msg: "Profile Updated Successfully", user: updatedUser });
  } catch (error) {
    console.error("Update ERROR:", error);
    return res.status(500).json({ msg: "Error updating profile" });
  }
};

