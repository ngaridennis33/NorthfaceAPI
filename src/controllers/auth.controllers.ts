import { LoginUserInput, RegisterUserInput } from './../schema/user.schema';
import { Request, Response, NextFunction, CookieOptions } from "express"; // NextFunction is a callback function that can be called to pass control to the next middleware or route handler in the stack.
import crypto from "crypto"; // Performs various hashing, encryption and decryption methods.
import bcrypt from 'bcryptjs'; //Hashing algorithm to  enhance the security of password storage.
import { createUserService, excludedFields, findUniqueUserService, signTokens } from "../services/user.service";
import { omit } from "lodash"; // used to create a new object that omits specified properties from an existing object for security eg password.
import { Prisma } from "@prisma/client";
import config from "config";

// TODO: Clearly explain this... Passing Cookies Logic
const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
};

// This describes how long the accessTokens are going to last.
const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
      Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

// Explain how long the refreshTokens are going to last.
const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
      Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};


// POST /api/auth/register - Register User Handler

export const registerUserHandler = async(
    req: Request<{}, {}, RegisterUserInput>,
    res:Response,
    next: NextFunction, 
    ) => {
        try {
            const { email, password, name } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);

            const verifyCode = crypto.randomBytes(32).toString('hex');
            const verificationCode = crypto.createHash('sha256').update(verifyCode).digest('hex');

            const user = await createUserService.registerUserHandler({
                name: name,
                email: email.toLowerCase(),
                password: hashedPassword,
                verificationCode,
            })

            const newUser = omit(user, excludedFields);
            res.status(201).json({
                status: "Success",
                data: {
                    user:newUser,
                }
            })
            
        } catch (err: any) {
            // Catch any errors thrown in the try block
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
              // Check if the error is a known Prisma client error
            if (err.code === 'P2002') {
            // Check if the Prisma error code is 'P2002'
            return res.status(409).json({
                status: 'fail',
                message: 'Email already exists, please use another email address',
            });
            }
        }
        // If the error is not a known Prisma client error or has a different code, pass it to the next middleware
        next(err);
        }
    }

// POST /api/auth/login - Login Registered user

export const loginUserHandler = async (
    req: Request<{}, {}, LoginUserInput>,
    res: Response,
    next: NextFunction
) => {

    try {
        
        const {email, password} = req.body;

        const user = await findUniqueUserService.loginUserHandler(
            // Check if the email is in the database.
            {email: email.toLocaleLowerCase()},

            // If the email is in the db, return these fields.
            {id: true,email: true, password: true, verified: true}
            );

            // if the user doesn't exist or the decrypted hashed password is not correct, return error.
            if (!user || !(await bcrypt.compare(password, user.password))){
                return next(Error);
            } 

            // Sign Tokens
            const {access_token, refresh_token} = await signTokens(user);
            res.cookie("access_token", access_token, accessTokenCookieOptions);
            res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);

            // TODO: Explain this part...
            res.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            res.status(200).json({
                status: 'success',
                access_token,
            });

    } catch (error: any) {
        next(error)
        
    }

}

// GET /api/auth/refresh - refreshAccessTokenHandler

// GET /api/auth/logout - Logout user handler





