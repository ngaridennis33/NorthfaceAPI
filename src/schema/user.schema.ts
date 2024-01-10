// zod- used to validate user's input
import {object, string, TypeOf, z} from 'zod';
import { RoleEnumType } from '@prisma/client';

export const createUserSchema = object({
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
        passwordConfirm: string({
            required_error: "Please Confirm password"
        }),
        role: z.optional(z.nativeEnum(RoleEnumType)),
    }).refine((data)=> data.password === data.passwordConfirm,{
        path: ["passworOnfirm"],
        message: "Passwords DO NOT match",
    })
})