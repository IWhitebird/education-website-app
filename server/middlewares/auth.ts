import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: any;
    files?: any;
  }

export async function auth(req :AuthenticatedRequest, res : Response , next : NextFunction) { 
    try{

        const token = req.cookies.token ||
                      req.body.token    ||  
                      req.header('Authorization')?.replace('Bearer ', '');

        if(!token){
            res.status(401).send({
                success:false,
                error: 'No Token Found'
            });
        }

        try{
            const decode = jwt.verify(token , process.env.JWT_SECRET!);
            console.log(decode);
            req.user = decode;
        } catch(err){
            console.log(err);
            res.status(401).send({
                success:false,
                error: 'Invalid Token'
            });
        }
        next();

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error: "Middleware Error"
        });
    }
}

export async function isStudent(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.accountType !== 'Student') {
        res.status(401).send({
          success: false,
          error: 'This is a protected route for students only',
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: 'Student Middleware Error',
      });
    }
  }
  
  export async function isInstructor(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.accountType !== 'Instructor') {
        res.status(401).send({
          success: false,
          error: 'This is a protected route for instructors only',
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: 'Instructor Middleware Error',
      });
    }
  }
  
  export async function isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.user?.accountType !== 'Admin') {
        res.status(401).send({
          success: false,
          error: 'This is a protected route for admins only',
        });
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error: 'Admin Middleware Error',
      });
    }
  }