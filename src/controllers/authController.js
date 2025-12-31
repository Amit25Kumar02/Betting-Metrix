import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/sendOtp.js";


// register
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, countryCode } = req.body;

    if (!fullName || !email || !password || !phone || !countryCode)
      return res.status(400).json({ msg: "All fields required" });
    const lowerEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) return res.status(400).json({ msg: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email: lowerEmail,
      password: hash,
      countryCode,
      phone,
      sports: [],
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ msg: "Account created", user: newUser, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error" });
  }
};

// save sports
export const saveSports = async (req, res) => {
  try {
    const { id } = req.user;
    const { sports } = req.body;

    await User.findByIdAndUpdate(id, { sports });

    res.json({ msg: "Sports saved", sports });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const check = await bcrypt.compare(password, user.password);
    if (!check) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ msg: "Logged in", user, token });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// delete account
export const deleteAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { password } = req.body;

    if (!password) return res.status(400).json({ msg: "Password required" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const check = await bcrypt.compare(password, user.password);
    if (!check) return res.status(400).json({ msg: "Invalid password" });

    await User.findByIdAndDelete(id);
    res.json({ msg: "Account deleted" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit

    // Save OTP in DB
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 5 * 60 * 1000; // valid 5 mins
    await user.save();

    // Send Email
    const sent = await sendOtpEmail(user.email, otp);
    if (!sent) return res.status(500).json({ msg: "Failed to send OTP" });

    return res.json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Verify OTP
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ msg: "Email & OTP required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.resetOtp || !user.resetOtpExpires)
      return res.status(400).json({ msg: "OTP not sent" });

    if (user.resetOtp !== otp)
      return res.status(400).json({ msg: "Invalid OTP" });

    if (user.resetOtpExpires < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    return res.json({ msg: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Reset password after OTP validation
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ msg: "All fields required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpires = null;
    await user.save();

    return res.json({ msg: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error" });
  }
};