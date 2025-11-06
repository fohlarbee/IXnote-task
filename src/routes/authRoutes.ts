import { Router } from 'express';
import { body } from 'express-validator';
import { login, register } from '../controllers/authController';
import { validate } from '../middleware/validation';

const router = Router();

router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ]),
  login
);

router.post(
  '/register',
  validate([
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
  ]),
  register
);

export default router;

