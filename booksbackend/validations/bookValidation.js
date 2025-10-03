import Joi from "joi";

const currentYear = new Date().getFullYear();

export const createBookSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Judul buku harus diisi",
    "string.min": "Judul buku minimal 3 karakter",
    "string.max": "Judul buku maksimal 100 karakter",
    "any.required": "Judul buku harus diisi",
  }),

  description: Joi.string().optional().allow("").max(1000).messages({
    "string.max": "Deskripsi maksimal 1000 karakter",
  }),

  publishedYear: Joi.number()
    .required()
    .integer()
    .min(1800)
    .max(currentYear)
    .messages({
      "number.base": "Tahun terbit harus berupa angka",
      "number.integer": "Tahun terbit harus berupa bilangan bulat",
      "number.min": "Tahun terbit tidak valid (min: 1800)",
      "number.max": `Tahun terbit tidak boleh lebih dari tahun ${currentYear}`,
      "any.required": "Tahun terbit harus diisi",
    }),

  authorId: Joi.number().required().integer().positive().messages({
    "number.base": "ID penulis harus berupa angka",
    "number.integer": "ID penulis harus berupa bilangan bulat",
    "number.positive": "ID penulis tidak valid",
    "any.required": "Penulis harus dipilih",
  }),

  publisherId: Joi.number().required().integer().positive().messages({
    "number.base": "ID penerbit harus berupa angka",
    "number.integer": "ID penerbit harus berupa bilangan bulat",
    "number.positive": "ID penerbit tidak valid",
    "any.required": "Penerbit harus dipilih",
  }),
});

export const updateBookSchema = createBookSchema;
