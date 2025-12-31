import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOtpEmail } from "../utils/sendOtp.js";
import  client  from "../config/redis.js";

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
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    await client.set(`otp:${email}`, otp, { EX: 300 });

    const sent = await sendOtpEmail(email, otp);
    if (!sent) return res.status(500).json({ msg: "Failed to send OTP" });

    return res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// verify otp

export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await client.get(`otp:${email}`);

    if (!storedOtp) return res.status(400).json({ msg: "OTP expired or not found" });
    if (storedOtp !== otp) return res.status(400).json({ msg: "Invalid OTP" });

   
    await client.del(`otp:${email}`);

    return res.json({ msg: "OTP verified" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// reset password

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const otpExists = await client.get(`otp:${email}`);
    if (otpExists) {
      return res.status(400).json({ msg: "OTP not verified yet!" });
    }

   
    const hash = await bcrypt.hash(newPassword, 10);

 
    await User.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true }
    );

    return res.status(200).json({ msg: "Password reset successfully" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};