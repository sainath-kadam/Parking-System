import AuditLog from '../models/AuditLog.js';
import { getISTNow } from '../utils/istTime.js';

export async function logAudit(data, session) {
  await AuditLog.create([{
    ...data,
    timestamp: getISTNow()
  }], { session });
}