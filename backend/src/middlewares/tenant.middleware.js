export default function tenantMiddleware(req, res, next) {
  if (!req.user || !req.user.tenantId) {
    return res.status(401).json({ message: 'Tenant not resolved' });
  }

  req.tenantId = req.user.tenantId;
  next();
}