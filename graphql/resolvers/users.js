const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const SECRET_KEY = process.env.SECRET_KEY;
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

const generateToken = (user) => {
  return jwt.sign({
    id: user.id,
    username: user.username,
    email: user.email
  }, SECRET_KEY, { expiresIn: '1d' });
};

module.exports = {
  Mutation: {
    async register(parent, { registerInput: { username, email, password, confirmPassword }}, context, info) {
      // Validate user data
      const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', errors);
      }
      // Make sure user doesnt exist
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken'
          }
        });
      }
      // Hash password and create auth token
      password = await bcrpyt.hash(password, 12);

      const newUser = new User({
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      };
    },

    async login(parent, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);

      const user = await User.findOne({ username });

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', errors);
      }

      const match = await bcrpyt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', errors);
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token
      };
    }
  }
}