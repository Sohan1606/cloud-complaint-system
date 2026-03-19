const { z } = require('zod');

// Auth validation
const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1)
});

// Complaint validation
const complaintSchema = z.object({
  title: z.string().min(3, 'Title too short').max(100),
  description: z.string().min(10, 'Description too short')
});

const statusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'resolved'])
});

module.exports = {
  registerSchema,
  loginSchema,
  complaintSchema,
  statusSchema
};

