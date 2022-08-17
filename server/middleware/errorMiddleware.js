const HttpError = require('../models/http-error.js');

const notFoundMiddleware = (req, res, next) =>
  next(new HttpError(`Not Found - ${req.originalUrl}`, 4004));

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  // res.status(err.code || 500).json({
  //   message: err.message || 'Something went wrong!',
  //   stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  // });

  res.status(400 || 500).json({ code: err.code }); // Dedicated for Assignment 3
};

module.exports = { notFoundMiddleware, errorMiddleware };
