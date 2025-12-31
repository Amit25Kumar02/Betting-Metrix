import Sport from "../models/Sport.js";

// Create
export const createSport = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: "Name required" });

    const lower = name.toLowerCase().trim();
    const exists = await Sport.findOne({ name: lower });
    if (exists) return res.status(400).json({ msg: "Sport already exists" });

    const icon = req.file?.path || null;

    const sport = await Sport.create({ name: lower, icon });
    return res.json({ msg: "Sport created", data: sport });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error" });
  }
};

// getAll
export const getSports = async (req, res) => {
  try {
    const sports = await Sport.find().sort({ createdAt: -1 });
    res.json({ count: sports.length, data: sports });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

// get with id
export const getSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);
    if (!sport) return res.status(404).json({ msg: "Not found" });
    res.json({ data: sport });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

// update
export const updateSport = async (req, res) => {
  try {
    const data = {};
    if (req.body.name) data.name = req.body.name.toLowerCase().trim();
    if (req.file) data.icon = req.file.path;

    const updated = await Sport.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ msg: "Sport updated", data: updated });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};

// delete with id
export const deleteSport = async (req, res) => {
  try {
    await Sport.findByIdAndDelete(req.params.id);
    res.json({ msg: "Sport deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error" });
  }
};
