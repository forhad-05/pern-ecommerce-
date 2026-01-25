import e, { Router } from 'express';   
import { userSignIn,userSignUp,getCurrentUser } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/sign-up', userSignUp);
router.post('/sign-in', userSignIn);
router.get('/me',authMiddleware, getCurrentUser);
export default router;