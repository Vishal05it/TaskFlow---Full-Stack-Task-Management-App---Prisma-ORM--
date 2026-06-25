export const otpGenerator = () => {
  let otp =
    Math.ceil(Math.random() * 10) * 10000 +
    Math.ceil(Math.random() * 10) * 1000 +
    Math.ceil(Math.random() * 10) * 100 +
    Math.ceil(Math.random() * 10) * 10 +
    Math.ceil(Math.random() * 10);
  return otp;
};
