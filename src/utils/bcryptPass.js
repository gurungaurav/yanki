import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  return hashedPass;
};

export const checkPassword = async (password, hashedPass) => {
  return bcrypt.compare(password, hashedPass);
};
