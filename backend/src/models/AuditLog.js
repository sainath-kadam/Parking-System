import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    entity: { type: String, required: true },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    action: { type: String, required: true },
    oldValue: { type: Object },
    newValue: { type: Object },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: { type: Date, required: true }
  },
  { versionKey: false }
);

export default mongoose.model('AuditLog', auditLogSchema);
