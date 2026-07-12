const AuditLog = require('../models/AuditLog');

// @desc  Get audit logs (most recent first)
// @route GET /api/audit-logs?entity=&action=
const getAuditLogs = async (req, res) => {
  try {
    const { entity, action } = req.query;
    const filter = {};
    if (entity) filter.entity = entity;
    if (action) filter.action = action;

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAuditLogs };
