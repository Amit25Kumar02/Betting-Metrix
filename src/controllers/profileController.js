import User from "../models/User.js";

// update profile
export const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { fullName,  countryCode, phone, sports } = req.body;
        const user = await User.findById(id);

        const updateData = {
            fullName,
            countryCode,
            phone,
            sports: sports ? JSON.parse(sports) : user.sports,
        };

        if (req.file) {
            updateData.profileImage = req.file.path || req.file.filename;
        }

        const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
        return res.json({ msg: "Profile updated", user: updated });

    } catch (err) {
        return res.status(500).json({ msg: "Error updating profile" });
    }
};
