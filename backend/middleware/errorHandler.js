// Central error handler — keeps controllers free of repetitive try/catch boilerplate style responses
export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
};

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Something went wrong on our end.",
  });
};
