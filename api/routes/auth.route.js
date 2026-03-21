import express from 'express';
import { signup, signin, google,  signout  } from '../controllers/auth.controller.js'; // Added 'google' here

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google); // This line will now work!
router.get('/signout', signout);
export default router;