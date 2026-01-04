import Settings from '../models/Settings.js';

export async function getSettings(tenantId) {
  return Settings.findOne({
    tenantId,
    isActive: true
  });
}

export async function updateSettings(tenantId, data, userId) {
  const settings = await Settings.findOne({
    tenantId,
    isActive: true
  });

  if (!settings) {
    return Settings.create({
      tenantId,
      ...data,
      updatedBy: userId
    });
  }

  Object.assign(settings, data, { updatedBy: userId });
  return settings.save();
}