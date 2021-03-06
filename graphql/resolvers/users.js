const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const SECRET_KEY = "some very secret key";
const {
  validateRegisterInput,
  validateLoginInput,
} = require("./../../utils/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    //login
    async login(_, { username, password }) {
      //const { error, valid } = validateLoginInput(username, password);

      // if (!valid) {
      //   throw new UserInputError("Error", { error });
      // }
      const user = await User.findOne({ username });
      if (!user) {
        error.general = "User not found";
        throw new UserInputError("Wrong credential", { error });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        error.general = "wrong credential";
        throw new UserInputError("Wrong credential", { error });
      }
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    //register
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) {
      const { valid, error } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );

      if (!valid) {
        throw new UserInputError("Error", { error });
      }
      const user = await User.findOne({ username });

      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "this username is taken",
          },
        });
      }
      password = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password,
        createAt: new Date().toISOString(),
      });
      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
