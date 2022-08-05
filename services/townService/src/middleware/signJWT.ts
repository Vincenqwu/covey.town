import jwt from 'jsonwebtoken';

const signJWT = (username : string) : string => {
  const token = jwt.sign({ username }, process.env.JWT_SECRET as string, {
    algorithm: 'HS256',
    expiresIn: '5h', // will be expired after 5 hours
  });
  return token;
};

export default signJWT;