import { LoginUserInput, RegisterUserInput, VerifyEmailInput } from './../schema/user.schema';
import { Request, Response, NextFunction, CookieOptions } from "express"; // NextFunction is a callback function that can be called to pass control to the next middleware or route handler in the stack.
import crypto from "crypto"; // Performs various hashing, encryption and decryption methods.
import bcrypt from 'bcryptjs'; //Hashing algorithm to  enhance the security of password storage.
import { createUserService, excludedFields, findUniqueUserService, signTokens, updateUserService } from "../services/user.service";
import { omit } from "lodash"; // used to create a new object that omits specified properties from an existing object for security eg password.
import { Prisma } from "@prisma/client";
import config from "config";
import AppError from '../utils/appError';
import { signJwt, verifyJwt } from '../utils/jwt';
import redisClient from '../utils/connectRedis';

// Define options for HTTP cookies
const cookiesOptions: CookieOptions = {
    // Set the 'httpOnly' option to true
    // This means that the cookie is accessible only through HTTP(S) requests
    // and cannot be accessed via client-side scripts (JavaScript running in the browser)
    httpOnly: true,

    // Set the 'sameSite' option to 'lax'
    // This controls when cookies are sent with cross-site requests
    // 'lax' means cookies will only be sent in a top-level navigation (e.g., following a link)
    // and will not be sent along with cross-site requests initiated by third-party websites
    // This is a security measure to prevent unauthorized websites from making requests to your server on behalf of the user
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

// This explains how long the refreshTokens are going to last.
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

            const user = await createUserService({
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

        const user = await findUniqueUserService(
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
            
            // Save the tokens in a cookie
            res.cookie("access_token", access_token, accessTokenCookieOptions); 
            res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
            
            // Set a cookie 'logged_in' with the value true, commonly used for tracking login status. Setting httpOnly to false makes it accessible to client-side JavaScript.
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

// POST /api/auth/refresh - refreshAccessTokenHandler

export const refreshAccessTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const refresh_token = req.cookies.refresh_token;
        const message = 'Could not refresh Access Token';

        if (!refresh_token){
            return next(new AppError(403, message));
        }

        // Validate the refresh token
        const decoded = verifyJwt<{sub: string}>(
            refresh_token,
            'refreshTokenPublicKey'
        )
        if (!decoded) {
            return next( new AppError(403, message));
        }

        // Check if the user has a valid session
        const session = await redisClient.get(decoded.sub);

        if (!session) {
            return next(new AppError(403, message));
        }

        // Check of the user still exists
        const user = await findUniqueUserService({ id: JSON.parse(session).id });

        if (!user) {
            return next(new AppError(403, message));
        }

        // Sign new access Token
        const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        });

        // 4. Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        // 5. Send response
        res.status(200).json({
            status: 'success',
            access_token,
            });
        } catch (err: any) {
            next(err);
    }
};

// DELETE /api/auth/logout - Logout user handler
function logout(res: Response) {
    res.cookie('access_token', '', { maxAge: 1 });
    res.cookie('refresh_token', '', { maxAge: 1 });
    res.cookie('logged_in', '', { maxAge: 1 });
}

export const logoutUserHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await redisClient.del(res.locals.user.id);
        logout(res);

        res.status(200).json({
            status: 'success',
        })
    } catch (err: any) {
        next(err)
    }
}

// POST /api/auth/verify - Verify Email Handler

export const verifyEmailHandler = async (
    req: Request<VerifyEmailInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const verificationCode = crypto
            .createHash('sha256')
            .update(req.params.verificationCode)
            .digest('hex');
        
        const user = await updateUserService(
            {verificationCode},
            {verified: true, verificationCode: null},
            {email: true}
        );

        if(!user) {
            return next (new AppError(401, 'Could not verify email'));
        }

        res.status(200).json({
            status: 'success',
            message:'Email verified successfully',
        })
        
    } catch (err: any) {
        if (err.code === 'P2025') {
            return res.status(403).json({
            status: 'fail',
            message: `Verification code is invalid or user doesn't exist`,
            });
        }
        next(err);
    }
};





