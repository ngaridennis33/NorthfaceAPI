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

export const updateUserSchema = object({
    body: object({
        name: string({}),
        email: string({}).email('Invalid email address'),
        password: string({})
        .min(8, 'Password must be more than 8 characters')
        .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: string({}),
        role: z.optional(z.nativeEnum(RoleEnumType)),
    })
        .partial()
        .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});

export const verifyEmailSchema = object({
    params: object({
    verificationCode: string(),
    }),
});

// Represents the expected input structure for user registration derived from the body property of the registerUserSchema, but with the passwordConfirm property excluded.
// This ensure that the passwordConfirm field is not included in the final data structure used for processing.
export type RegisterUserInput = Omit<
    TypeOf<typeof registerUserSchema>['body'],
    'passwordConfirm'
>;


export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
export type VerifyEmailInput = TypeOf<typeof verifyEmailSchema>['params'];
export type UpdateUserInput = TypeOf<typeof updateUserSchema>['body'];