const AuditLog = require('../models/AuditLog');

// Fire-and-forget - an audit log failure shouldn't break the action it's
// recording.
const logAudit = async (req, action, entity, entityId, details) => {
  try {
    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name,
      action,
      entity,
      entityId,
      details,
    });
  } catch (error) {
    console.error('logAudit failed:', error.message);
  }
};

module.exports = { logAudit };
