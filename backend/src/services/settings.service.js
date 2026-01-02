import Settings from '../models/Settings.js';

export async function getSettings() {
  return Settings.findOne({ isActive: true });
}

export async function updateSettings(data, userId) {
  const settings = await Settings.findOne({ isActive: true });

  if (!settings) {
    return Settings.create({
      ...data,
      updatedBy: userId
    });
  }

  Object.assign(settings, data, { updatedBy: userId });
  return settings.save();
}
