import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyJWT = (req: Request, res: Response, next: NextFunction): any=> {
  const token = req.headers['x-access-token'] as string;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
      if (err) {
                
        res.status(404).json({
          message: err,
          err,
        });
        return;
      } 
      res.locals.jwt = decoded;
      next();
      
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized',
    });
  }
};

export default verifyJWT;