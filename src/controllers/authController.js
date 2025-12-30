import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// register
export const register = async (req, res) => {
  try {
    const { fullName, email, password, phone, countryCode } = req.body;

    if (!fullName || !email || !password || !phone || !countryCode)
      return res.status(400).json({ msg: "All fields required" });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Email already used" });

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
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
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
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
    await User.findByIdAndDelete(id);
    res.json({ msg: "Account deleted" });
  } catch {
    res.status(500).json({ msg: "Error" });
  } 
};

