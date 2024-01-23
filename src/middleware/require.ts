import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

export const requireUser = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const user = res.locals.user;

        if (!user) {
        return next(
            new AppError(400, `Session has expired or user doesn't exist`)
        );
        }

        next();
    } catch (err: any) {
        next(err);
    }
};

export const checkUserRole = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    // TODO: Authenticate and Authorize on the Server:
    const userRole = res.locals.user?.role;
    
    if (userRole === 'Admin'){
        next()
    } else{
        next(new AppError(403, 'Forbidden!'))
    }
}