import { NextFunction, Request, Response } from 'express';
import { excludedFields, getAllUsersService, updateUserService } from '../services/user.service';
import { UpdateUserInput } from '../schema/user.schema';
import { omit } from "lodash"; // used to create a new object that omits specified properties from an existing object for security eg password.
import AppError from '../utils/appError';


// GET get User Handler(LoggedIn User Session)
export const getMeHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
    const user = res.locals.user;
    const loggedInUser = omit(user,excludedFields);
    res.status(200).status(200).json({
        status: 'success',
        data: {
            loggedInUser,
        },
    });
    } catch (err: any) {
    next(err);
    }
};

// GET Get all users in the DB.
export const getAllUsersHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
    )=> {
        try {
            const users = await getAllUsersService();
            
            if (!users) {
                return next(new AppError(401, 'Forbidden'));
            }
            const allUsers = omit(users, excludedFields)
            res.status(200).status(200).json({
                status: 'success',
                data: {
                    allUsers,
                }
            });
            


        } catch (error) {
            next(error)
            
        }
}

// Update User Profile
export const updateUserHandler = async (
    req: Request<{}, {}, UpdateUserInput>,
    res: Response,
    next: NextFunction,
) => {

    try {
        const user = res.locals.user;
        const {name, email } = req.body;

        // Update the user data with defined fields.
        const userData: Partial<UpdateUserInput> = {};
        if (name !== undefined) userData.name = name;

        // TODO Send the verification code to the new email set
        if (email !== undefined) userData.email = email;

        const updatedUserData = await updateUserService({id:user.id},userData);
        const newUser = omit(updatedUserData,excludedFields);

        res.status(200).json(newUser);

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
// Delelete User
/**
 * TODO: const deleteUser = async(req,res) => {
 *  const token = req.cookies.accessToken;
 *  if(!token) return res.status(401).send("You are not authenticated!")
 * }
 * 
 */

// Delete user