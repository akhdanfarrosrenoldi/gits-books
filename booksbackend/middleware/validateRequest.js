import { validationErrorResponse } from "../utils/responseFormatter.js";

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((err) => ({
        field: err.path[0],
        message: err.message.replace(/['"]/g, ""),
      }));

      return validationErrorResponse(res, errors, "Validation failed");
    }

    next();
  };
};

export default validateRequest;
