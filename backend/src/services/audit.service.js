import AuditLog from '../models/AuditLog.js';
import { getISTNow } from '../utils/istTime.js';

export async function logAudit({
  entity,
  entityId,
  action,
  oldValue,
  newValue,
  performedBy
}) {
  await AuditLog.create({
    entity,
    entityId,
    action,
    oldValue,
    newValue,
    performedBy,
    timestamp: getISTNow()
  });
}
