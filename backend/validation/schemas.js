// Central location for all Zod validation schemas.
const { z } = require('zod');

// --- User Registration Schema ---
// Addresses feedback: password regex and max values for all properties.
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username cannot exceed 50 characters"),
  email: z.string().email("Invalid email address").max(100, "Email cannot exceed 100 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100, "Full name cannot exceed 100 characters"),
  // Regex requires: at least 8 chars, one uppercase, one lowercase, one number, one special character.
  password: z.string().min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
});

// --- User Login Schema ---
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});


// --- Candidate Schema ---
// Addresses feedback: Malaysian phone regex and coercing experience_years to a number.
const candidateSchema = z.object({
  name: z.string().min(2, "Name is required").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Invalid email format").max(100, "Email cannot exceed 100 characters"),
  // Regex for Malaysian phone numbers (e.g., +60123456789, 012-3456789)
  phone: z.string()
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/, "Invalid Malaysian phone number format")
    .optional(),
  position: z.string().min(2, "Position is required").max(100, "Position cannot exceed 100 characters"),
  skills: z.string().max(500, "Skills cannot exceed 500 characters").optional(),
  // As suggested, z.coerce.number() will convert a string like "5" into the number 5.
  experience_years: z.coerce.number().int().min(0, "Experience cannot be negative").max(50, "Experience seems too high"),
  status: z.enum(['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']),
  notes: z.string().max(2000, "Notes cannot exceed 2000 characters").optional(),
});


module.exports = {
  registerSchema,
  loginSchema,
  candidateSchema
};