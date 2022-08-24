const HttpError = require('../models/http-error.js');

// err.code with 4 digits is dedicated for Assignment 3

const notFoundMiddleware = (req, res, next) => {
  err.code.toString().length !== 4
    ? next(new HttpError(`Not Found - ${req.originalUrl}`, 4004))
    : next(new HttpError(`Not Found - ${req.originalUrl}`, 404));
};

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.code.toString().length !== 4)
    res.status(err.code || 500).json({
      message: err.message || 'Something went wrong!',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  else res.status(400 || 500).json({ code: err.code }); // Dedicated for Assignment 3
};

module.exports = { notFoundMiddleware, errorMiddleware };
