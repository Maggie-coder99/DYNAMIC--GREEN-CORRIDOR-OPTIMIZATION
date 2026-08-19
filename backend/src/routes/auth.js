import { Router } from 'express';
import { store } from '../models/store.js';
import { signToken } from '../middleware/auth.js';
import { loginSchema, validate } from '../middleware/validate.js';

export const authRouter = Router();

authRouter.post('/login', validate(loginSchema), (req, res) => {
  const { email, password, role } = req.body;
  const user = store.findUser(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' });
  }
  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, title: user.title },
  });
});

authRouter.get('/demo-accounts', (_req, res) => {
  res.json({
    accounts: store.getUsers().map((u) => ({
      email: u.email,
      role: u.role,
      name: u.name,
      password: 'demo123',
    })),
  });
});
