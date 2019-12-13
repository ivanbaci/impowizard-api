const validateRequest = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessage = error.details.map(d => d.message);
      res.status(400).json({
        code: 'bad_request',
        message: errorMessage,
      });
      return;
    } else next();
  };
};

module.exports = { validateRequest };
