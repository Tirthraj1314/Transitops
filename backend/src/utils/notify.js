const User = require('../models/User');
const Notification = require('../models/Notification');

// Creates one notification per user with the given role(s). Fire-and-forget -
// failures here shouldn't break the action that triggered them.
const notifyRole = async (roles, type, message) => {
  try {
    const roleList = Array.isArray(roles) ? roles : [roles];
    const users = await User.find({ role: { $in: roleList }, isActive: true }).select('_id');
    if (users.length === 0) return;
    await Notification.insertMany(users.map((u) => ({ user: u._id, type, message })));
  } catch (error) {
    console.error('notifyRole failed:', error.message);
  }
};

const notifyUser = async (userId, type, message) => {
  try {
    if (!userId) return;
    await Notification.create({ user: userId, type, message });
  } catch (error) {
    console.error('notifyUser failed:', error.message);
  }
};

module.exports = { notifyRole, notifyUser };
