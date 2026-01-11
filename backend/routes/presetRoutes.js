// routes/presetRoutes.js

import express from "express";
import {
  createPreset,
  getPresets,
  getPresetById,
  updatePreset,
  deletePreset,
  getActivePresets,
  getPresetsByTag,
} from "../controllers/presetController.js";

const router = express.Router();

// routes/presetRoutes.js
router.get('/active', getActivePresets);
router.get('/tag', getPresetsByTag); // New route
router.get('/', getPresets);
router.get('/:id', getPresetById);
router.post('/', createPreset);
router.put('/:id', updatePreset);
router.delete('/:id', deletePreset);


export default router;
