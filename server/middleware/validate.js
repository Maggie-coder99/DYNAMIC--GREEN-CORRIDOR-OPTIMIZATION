import { z } from 'zod';

export function validate(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid request',
        code: 'VALIDATION_ERROR',
        details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
      });
    }
    req.body = parsed.data;
    return next();
  };
}

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(['emergency_operator', 'traffic_control', 'administrator']).optional(),
});

export const emergencySchema = z.object({
  ambulanceId: z.string().min(3),
  hospitalId: z.string().min(3),
  level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  demo: z.boolean().optional(),
});

export const ambulanceSchema = z.object({
  registration: z.string().min(4),
  driver: z.string().min(2),
  lat: z.number(),
  lng: z.number(),
  status: z.enum(['Available', 'On Emergency', 'Returning', 'Maintenance']).optional(),
  equipment: z.array(z.string()).optional(),
  station: z.string().optional(),
  nodeId: z.string().optional(),
});

export const hospitalSchema = z.object({
  name: z.string().min(3),
  lat: z.number(),
  lng: z.number(),
  nodeId: z.string().min(2),
  emergencyCapacity: z.number().int().positive().optional(),
  availableBeds: z.number().int().nonnegative().optional(),
  edStatus: z.enum(['Accepting', 'Busy', 'Limited']).optional(),
  address: z.string().optional(),
  specialties: z.array(z.string()).optional(),
});

export const optimizeSchema = z.object({
  startNode: z.string().min(2),
  goalNode: z.string().min(2),
  level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
});

export const signalOverrideSchema = z.object({
  state: z.enum(['RED', 'YELLOW', 'GREEN', 'EMERGENCY_GREEN']),
});
