import redisClient from './../utils/connectRedis';
import { registerUserHandler } from './../controllers/auth.controllers';
import { PrismaClient, Prisma, User } from "@prisma/client";
import config from 'config';
import { signJwt } from '../utils/jwt';

export const excludedFields = ['password', 'verified', 'verificationCode']; 

const prisma = new PrismaClient();


export const createUserService = {
    /**
     * Creates a new User in the database.
     * @param newUserData - The data for the new user.
     * @returns A promise that resolves to the created product.
     * @throws {Error} Throws an error if there's an issue creating the user.
     */

    //TODO: Why are undefined inputs not throwing an error

    registerUserHandler: async (newUserData: Prisma.UserCreateInput): Promise<User> => {
        // Create a new user in the database using Prisma
        const createdUser = await prisma.user.create({
        data: newUserData,
        }) as User;

        return createdUser;
    },
};


export const findUniqueUserService = {
    /**
     * Finds a unique user in the database.
     * @param UniqueUserData - The data for the new user.
     * @returns A promise that resolves to the created product.
     * @throws {Error} Throws an error if there's an issue creating the user.
     */

    loginUserHandler: async (
        where: Prisma.UserWhereUniqueInput,
        select?: Prisma.UserSelect
    ) => {
        return (await prisma.user.findUnique({
            where,
            select
        })) as User;
    }
}

export const signTokens = async (user: Prisma.UserCreateInput) => {
    // 1. Create Session
    redisClient.set(`${user.id}`, JSON.stringify(user),{
        EX: config.get<number>('redisCacheExpiresIn') * 60,
    });

    // 2. Create access and refresh Tokens.
    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return {access_token, refresh_token};

}
