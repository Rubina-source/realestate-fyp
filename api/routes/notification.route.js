import express from 'express';
import {
  getMyNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from '../controllers/notification.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getMyNotifications);
router.get('/unread-count', authenticateToken, getUnreadCount);
router.patch('/read-all', authenticateToken, markAllNotificationsRead);
router.patch('/:id/read', authenticateToken, markNotificationRead);

export default router;
