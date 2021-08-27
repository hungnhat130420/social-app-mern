module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const error = {};
  if (username.trim() === "") {
    error.username = "username must not empty";
  }
  if (email.trim() === "") {
    error.email = "email must not empty";
  } else {
    const regEx = /^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$/;
    if (!email.match(regEx)) {
      error.email = "email must be a valid email address";
    }
  }
  if (password.trim() === "") {
    error.password = "password must not be empty";
  } else if (password !== confirmPassword) {
    error.confirmPassword = "password not match";
  }

  return {
    error,
    valid: Object.keys(error).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const error = {};
  if (username.trim() === "") {
    error.username = "username must not empty";
  }
  if (password.trim() === "") {
    error.password = "password must not empty";

    return {
      error,
      valid: Object.keys(error).length < 1,
    };
  }
};
