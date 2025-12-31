import Tip from "../models/Tip.js";

// create
export const createTip = async (req, res) => {
    try {
        const { sport, homeTeam, awayTeam, winPercent, risk, tip, matchTime } = req.body;

        const homeLogo = req.files?.homeLogo?.[0]?.path || null;
        const awayLogo = req.files?.awayLogo?.[0]?.path || null;

        const data = {
            sport,
            homeTeam,
            awayTeam,
            winPercent,
            risk,
            tip,
            matchTime,
            homeLogo,
            awayLogo
        };

        const created = await Tip.create(data);
        return res.json({ status: true, msg: "Tip created", data: created });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, msg: "Server error" });
    }
};

// get all
export const getTips = async (req, res) => {
    try {
        const { type, start, end } = req.query;
        const query = {};

        if (type === "past") query.matchTime = { $lt: new Date() };
        if (type === "today") {
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            query.matchTime = { $gte: today, $lt: tomorrow };
        }
        if (type === "future") query.matchTime = { $gte: new Date() };

        if (start && end) {
            query.matchTime = { $gte: new Date(start), $lte: new Date(end) };
        }

        const tips = await Tip.find(query).sort({ matchTime: 1 });

        return res.json({ status: true, count: tips.length, data: tips });
    } catch (err) {
        console.error("GET ERROR:", err);
        return res.status(500).json({ status: false, msg: "Server error" });
    }
};

// get with id
export const getTipById = async (req, res) => {
    try {
        const tip = await Tip.findById(req.params.id);
        if (!tip) return res.status(404).json({ status: false, msg: "Tip not found" });

        return res.json({ status: true, data: tip });
    } catch (err) {
        console.error("GET ERROR:", err);
        return res.status(500).json({ status: false, msg: "Server error" });
    }
};

// update with id
export const updateTip = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure req.body exists
        const body = req.body ?? {};

        const updateData = {};

        if (body.sport) updateData.sport = body.sport;
        if (body.homeTeam) updateData.homeTeam = body.homeTeam;
        if (body.awayTeam) updateData.awayTeam = body.awayTeam;
        if (body.winPercent) updateData.winPercent = body.winPercent;
        if (body.risk) updateData.risk = body.risk;
        if (body.tip) updateData.tip = body.tip;
        if (body.matchTime) updateData.matchTime = new Date(body.matchTime);

        // LOG FILES
        if (req.files?.homeLogo) updateData.homeLogo = req.files.homeLogo[0].path;
        if (req.files?.awayLogo) updateData.awayLogo = req.files.awayLogo[0].path;

        const updated = await Tip.findByIdAndUpdate(id, updateData, { new: true });

        return res.json({ status: true, msg: "Tip updated", data: updated });
    } catch (error) {
        console.log("UPDATE ERROR:", error);
        return res.status(500).json({ status: false, msg: "Server error" });
    }
};


// delete
export const deleteTip = async (req, res) => {
    try {
        const deleted = await Tip.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ status: false, msg: "Tip not found" });

        return res.json({ status: true, msg: "Tip deleted" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        return res.status(500).json({ status: false, msg: "Server error" });
    }
};

// favorite
export const toggleFavorite = async (req, res) => {
    try {
        const tip = await Tip.findById(req.params.id);
        if (!tip) return res.status(404).json({ status: false, msg: "Tip not found" });

        tip.isFavorite = !tip.isFavorite;
        await tip.save();

        return res.json({ status: true, msg: "Favorite toggled", data: tip });
    } catch (err) {
        console.error("FAVORITE ERROR:", err);
        return res.status(500).json({ status: false, msg: "Server error" });
    }
};
