import { NextFunction, Request, Response } from 'express';
import { updateUserService } from '../services/user.service';
import { UpdateUserInput } from '../schema/user.schema';


//Get logged in user
export const getUserHandler = async (
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

// Update profile
export const updateUserHandler = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
) => {

    try {
        const userEmail = res.locals.user.email;
        const {name, email } = req.body;
        console.log(userEmail)

        // Update the user data with defined fields.
        const userData: Partial<UpdateUserInput> = {};
        if (name !== undefined) userData.name = name;
        if (email !== undefined) userData.email = email;
        // if (image !== undefined) userData.image = image;

        const updatedUserData = await updateUserService(userEmail,userData,res.locals.user.id);

        res.status(200).json(updatedUserData);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// create session
// get sessions
// Delelete sessions 
// login
// Get user profile

// logout
// Delete user
// Get all users