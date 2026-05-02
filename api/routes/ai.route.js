import express from 'express';
import { brokerPropertyChat } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/chat', brokerPropertyChat);

export default router;
