"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyEmailSchema = exports.updateUserSchema = exports.loginUserSchema = exports.registerUserSchema = void 0;
const zod_1 = require("zod"); // zod- used to validate user's input
const client_1 = require("@prisma/client");
exports.registerUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: "Name is required",
        }),
        email: (0, zod_1.string)({
            required_error: "Email address is required",
        }),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        })
            .min(8, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        confirmPassword: (0, zod_1.string)({
            required_error: "Please Confirm password"
        }),
        role: zod_1.z.optional(zod_1.z.nativeEnum(client_1.RoleEnumType)),
    }).refine((data) => data.password === data.confirmPassword, {
        path: ["passworConfirm"],
        message: "Passwords DO NOT match",
    })
});
exports.loginUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "Email address is required",
        }).email("Invalid email address"),
        password: (0, zod_1.string)({
            required_error: "Password is required",
        }).min(8, "Invalid email or password"),
    })
});
exports.updateUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({}),
        email: (0, zod_1.string)({}).email('Invalid email address'),
        password: (0, zod_1.string)({})
            .min(8, 'Password must be more than 8 characters')
            .max(32, 'Password must be less than 32 characters'),
        passwordConfirm: (0, zod_1.string)({}),
        role: zod_1.z.optional(zod_1.z.nativeEnum(client_1.RoleEnumType)),
    })
        .partial()
        .refine((data) => data.password === data.passwordConfirm, {
        path: ['passwordConfirm'],
        message: 'Passwords do not match',
    }),
});
exports.verifyEmailSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        verificationCode: (0, zod_1.string)(),
    }),
});
exports.forgotPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email is required',
        }).email('Email is invalid'),
    }),
});
exports.resetPasswordSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        resetToken: (0, zod_1.string)(),
    }),
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(8, 'Password must be more than 8 characters'),
        passwordConfirm: (0, zod_1.string)({
            required_error: 'Please confirm your password',
        }),
    }).refine((data) => data.password === data.passwordConfirm, {
        message: 'Passwords do not match',
        path: ['passwordConfirm'],
    }),
});
//# sourceMappingURL=user.schema.js.map