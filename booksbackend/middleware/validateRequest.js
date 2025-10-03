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

      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

export default validateRequest;
