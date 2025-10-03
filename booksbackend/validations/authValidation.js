import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().required().email().max(100).messages({
    "string.empty": "Email harus diisi",
    "string.email": "Format email tidak valid",
    "string.max": "Email maksimal 100 karakter",
    "any.required": "Email harus diisi",
  }),

  password: Joi.string().required().min(6).max(50).messages({
    "string.empty": "Password harus diisi",
    "string.min": "Password minimal 6 karakter",
    "string.max": "Password maksimal 50 karakter",
    "any.required": "Password harus diisi",
  }),
});
