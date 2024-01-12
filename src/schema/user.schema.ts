import {object, string, TypeOf, z} from 'zod'; // zod- used to validate user's input
import { RoleEnumType } from '@prisma/client';

export const registerUserSchema = object({
    body: object({
        name: string({
            required_error: "Name is required",
        }),
        email: string({
            required_error: "Email address is required",
        }),
        password: string({
            required_error: "Password is required",
        })
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
        confirmPassword: string({
            required_error: "Please Confirm password"
        }),
        role: z.optional(z.nativeEnum(RoleEnumType)),
    }).refine((data)=> data.password === data.confirmPassword,{
        path: ["passworConfirm"],
        message: "Passwords DO NOT match",
    })
})


// Represents the expected input structure for user registration derived from the body property of the registerUserSchema, but with the passwordConfirm property excluded.
// This ensure that the passwordConfirm field is not included in the final data structure used for processing.
export type RegisterUserInput = Omit<
    TypeOf<typeof registerUserSchema>['body'],
    'passwordConfirm'
>;

export const loginUserSchema = object({
    body: object({
        email: string({
            required_error: "Email address is required",
        }).email("Invalid email address"),
        password: string({
            required_error: "Password is required",
        }).min(8, "Invalid email or password"),
    })
})

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];