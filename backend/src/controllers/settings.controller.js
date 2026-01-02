import { getSettings, updateSettings } from '../services/settings.service.js';

export async function getSettings(req, res) {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
}

export async function updateSettings(req, res) {
  try {
    const updated = await updateSettings(req.body, req.user.userId);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
