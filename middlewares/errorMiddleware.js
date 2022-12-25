export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal server error';

  res.status(err.statusCode).send({
    status: false,
    error: err.message,
  });
};
