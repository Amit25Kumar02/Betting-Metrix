import User from "../models/User.js";
import fs from "fs";
import path from "path";

// update profile
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { fullName, email, countryCode, phone, sports } = req.body;
        const user = await User.findById(id);

        const updateData = {
            fullName,
            email,
            countryCode,
            phone,
            sports: sports ? JSON.parse(sports) : user.sports,
        };


        if (req.file) {
            if (user.profileImage) {
                const oldFile = path.join("uploads/profile/", user.profileImage);

                if (fs.existsSync(oldFile)) {
                    fs.unlink(oldFile, (err) => {
                        if (err) console.log("Delete failed:", err);
                    });
                } else {
                    console.log("⚠ Old image file not found, skipping delete");
                }
            }

            updateData.profileImage = req.file.filename;
        }


        const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
        return res.json({ msg: "Profile updated", user: updated });

    } catch (err) {
        return res.status(500).json({ msg: "Error updating profile" });
    }
};
