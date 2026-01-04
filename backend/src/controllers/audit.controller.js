import AuditLog from '../models/AuditLog.js';

export async function getAuditLogs(req, res) {
  try {
    const query = {};

    if (req.user.role !== 'SYSTEM_OWNER') {
      query.tenantId = req.tenantId;
    }

    const logs = await AuditLog.find(query)
      .populate('performedBy', 'name role')
      .sort({ timestamp: -1 })
      .limit(500);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch audit logs' });
  }
}