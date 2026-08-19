import { Router } from 'express';
import { store } from '../models/store.js';
import { contactSchema, validate } from '../middleware/validate.js';

export const publicRouter = Router();

publicRouter.post('/contact', validate(contactSchema), (req, res) => {
  const saved = store.addMessage(req.body);
  store.addLog('info', `Contact message from ${saved.email}.`);
  res.status(201).json({
    ok: true,
    message: 'Thanks. Your message was recorded in the demo inbox (simulation only).',
    id: saved.id,
  });
});
