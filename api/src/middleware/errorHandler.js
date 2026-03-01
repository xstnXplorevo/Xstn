const errorHandler = (err, req, res, next) => {
  console.error("Error", err);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};

export default errorHandler;
