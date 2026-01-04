import {
  getSettings as getSettingsService,
  updateSettings as updateSettingsService
} from '../services/settings.service.js';


export async function getSettings(req, res) {
  try {
    const settings = await getSettingsService(req.tenantId);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
}

export async function updateSettings(req, res) {
  try {
    const updated = await updateSettingsService(
      req.tenantId,
      req.body,
      req.user.userId
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
