import { NextFunction, Request, Response } from 'express';


//Get logged in user
export const getMeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
    const user = res.locals.user;

    res.status(200).status(200).json({
        status: 'success',
        data: {
        user,
        },
    });
    } catch (err: any) {
    next(err);
    }
};


// create session
// get sessions
// Delelete sessions 
// login
// Get user profile
// Update profile
// logout
// Delete user
// Get all users