import { RegisterUserInput } from './../schema/user.schema';
import { Request, Response, NextFunction } from "express"; // NextFunction is a callback function that can be called to pass control to the next middleware or route handler in the stack.
import crypto from "crypto"; // Performs various hashing, encryption and decryption methods.
import bcrypt from 'bcryptjs'; //Hashing algorithm to  enhance the security of password storage.
import { createUserService, excludedFields } from "../services/user.service";
import { omit } from "lodash"; // used to create a new object that omits specified properties from an existing object for security eg password.
import { Prisma } from "@prisma/client";


// POST /api/auth/register - Register User Handler

export const registerUserHandler = async(
    req: Request<{}, {}, RegisterUserInput>,
    res:Response,
    next: NextFunction, 
    ) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 12);

            const verifyCode = crypto.randomBytes(32).toString('hex');
            const verificationCode = crypto.createHash('sha256').update(verifyCode).digest('hex');

            const user = await createUserService.registerUserHandler({
                name: req.body.name,
                email: req.body.email.toLowerCase(),
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

// GET /api/auth/refresh - refreshAccessTokenHandler

// GET /api/auth/logout - Logout user handler





