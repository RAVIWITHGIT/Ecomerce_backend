const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  try {
    const saltRouds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRouds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
