import Joi from "joi";

export const createPublisherSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Nama penerbit harus diisi",
    "string.min": "Nama penerbit minimal 3 karakter",
    "string.max": "Nama penerbit maksimal 100 karakter",
    "any.required": "Nama penerbit harus diisi",
  }),

  address: Joi.string().optional().allow("").max(200).messages({
    "string.max": "Alamat maksimal 200 karakter",
  }),
});

export const updatePublisherSchema = createPublisherSchema;
