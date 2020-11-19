const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');
const SECRET_KEY = process.env.SECRET_KEY;

module.exports = context => {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    // Bearer ....
    const token = authHeader.split('Bearer ')[1];

    if (token) {
      try {
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (error) {
        throw new AuthenticationError('Invalid/Expried token');
      }
    }

    throw new Error('Authentication token format must be "Bearer [token]"');
  }

  throw new Error('Authentication token must be provided');
}