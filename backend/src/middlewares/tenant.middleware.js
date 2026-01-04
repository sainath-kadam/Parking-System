import Tenant from '../models/Tenant.js';

export default async function tenantMiddleware(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  if (req.user.role === 'SYSTEM_OWNER') return next();

  if (!req.user.tenantId) {
    return res.status(401).json({ message: 'Tenant not resolved' });
  }

  const tenant = await Tenant.findById(req.user.tenantId);
  if (!tenant || !tenant.isActive) {
    return res.status(403).json({ message: 'Tenant is disabled' });
  }

  req.tenantId = req.user.tenantId;
  next();
}
