import Joi from "joi";

export const createAuthorSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Nama penulis harus diisi",
    "string.min": "Nama penulis minimal 3 karakter",
    "string.max": "Nama penulis maksimal 100 karakter",
    "any.required": "Nama penulis harus diisi",
  }),

  bio: Joi.string().optional().allow("").max(1000).messages({
    "string.max": "Biografi maksimal 1000 karakter",
  }),
});

export const updateAuthorSchema = createAuthorSchema;
