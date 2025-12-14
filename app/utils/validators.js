// src/utils/validators.js
export const validatePassword = (pw) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return regex.test(pw);
};
