import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
) => {
  const accessToken = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  } as SignOptions);
  // console.log('accessToken', accessToken);

  return accessToken;
};

export const VerifyToken = (token: string, secret: string) => {
  const verifyToken = jwt.verify(token, secret);
  // console.log('verifyToken', verifyToken);

  return verifyToken;
};
