import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';

export const createNotification = async ({
  recipientId,
  actorId = null,
  type,
  title,
  message,
  link = null,
  entityType = null,
  entityId = null,
}) => {
  if (!recipientId || !type || !title || !message) {
    return null;
  }

  return Notification.create({
    recipient: recipientId,
    actor: actorId,
    type,
    title,
    message,
    link,
    entityType,
    entityId,
  });
};

export const createRoleNotifications = async ({
  role,
  actorId = null,
  type,
  title,
  message,
  link = null,
  entityType = null,
  entityId = null,
}) => {
  if (!role || !type || !title || !message) {
    return [];
  }

  const users = await User.find({ role }).select('_id');
  if (!users.length) {
    return [];
  }

  const docs = users.map((user) => ({
    recipient: user._id,
    actor: actorId,
    type,
    title,
    message,
    link,
    entityType,
    entityId,
  }));

  return Notification.insertMany(docs);
};
