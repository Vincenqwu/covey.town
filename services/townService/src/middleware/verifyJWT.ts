const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from 'express';

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers["x-access-token"]
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
                
        return res.status(404).json({
          message: err,
          err
        });
      } else {
        res.locals.jwt = decoded;
        next();
      }
  });
  } else {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
};

export default verifyJWT;