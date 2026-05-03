export const validateSchema = (schema, target = "body") => {
  return (req, res, next) => {
    const data = req[target];

    if (!data) {
      return res.status(400).json({
        code: "BAD_REQUEST",
        message: `Se requiere ${target}`
      });
    }

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const details = error.details.map(d => d.message);

      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Error de validación",
        errors: details // 👈 siempre array
      });
    }

    next();
  };
};