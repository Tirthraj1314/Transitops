const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String }, // denormalized so logs survive user deletion
    action: { type: String, required: true }, // e.g. "CREATE_VEHICLE", "DELETE_USER"
    entity: { type: String, required: true }, // e.g. "Vehicle", "User"
    entityId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
