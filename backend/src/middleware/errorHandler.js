const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);
  console.error("STACK:", err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : "Terjadi kesalahan pada server";

  res.status(statusCode).json({
    success: false,
    message,
    detail: err.message,
  });
};

export default errorHandler;
