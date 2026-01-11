// controllers/presetController.js
import Preset from "../models/Preset.js";

// Create a new preset
export const createPreset = async (req, res) => {
  try {
    const preset = await Preset.create(req.body);
    res.status(201).json({ success: true, data: preset });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Get active presets (filtered by hotel)
export const getActivePresets = async (req, res) => {
  try {
    const { hotelId } = req.query;
    
    const query = { isActive: true };
    if (hotelId) {
      query.hotel = hotelId;
    }

    const presets = await Preset.find(query)
      .populate("items.item", "name price images slug vegOrNonVeg")
      .populate("hotel", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: presets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all presets (filtered by hotel)
export const getPresets = async (req, res) => {
  try {
    const { hotelId } = req.query;
    
    const query = {};
    if (hotelId) {
      query.hotel = hotelId;
    }

    const presets = await Preset.find(query)
      .populate("items.item")
      .populate("hotel", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: presets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single preset
export const getPresetById = async (req, res) => {
  try {
    const preset = await Preset.findById(req.params.id)
      .populate("items.item")
      .populate("hotel", "name");
    
    if (!preset) {
      return res.status(404).json({ success: false, error: "Preset not found" });
    }

    res.json({ success: true, data: preset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update a preset
export const updatePreset = async (req, res) => {
  try {
    const updated = await Preset.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!updated) {
      return res.status(404).json({ success: false, error: "Preset not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete a preset
export const deletePreset = async (req, res) => {
  try {
    const deleted = await Preset.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Preset not found" });
    }

    res.json({ success: true, message: "Preset deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ NEW: Get presets by tag (e.g., "SpecialOffers")
export const getPresetsByTag = async (req, res) => {
  try {
    const { tag, hotelId } = req.query;
    
    const query = { isActive: true };
    if (tag) query.tag = tag;
    if (hotelId) query.hotel = hotelId;

    const presets = await Preset.find(query)
      .populate("items.item", "name price images slug")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: presets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
