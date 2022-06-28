const { verify } = require('jsonwebtoken');

const authMiddleware = (req) => {
  const authorization = req.headers['authorization'];
  if (!authorization) throw new Error('You need to login');

  const token = authorization.split(' ')[1];
  const { userId } = verify(token, process.env.JWT_SECRET);
  return userId;
};

module.exports = { authMiddleware };
