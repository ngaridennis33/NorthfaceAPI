import redisClient from './../utils/connectRedis';
import { PrismaClient, Prisma, User } from "@prisma/client";
import config from 'config';
import { signJwt } from '../utils/jwt';

export const excludedFields = [
    "password",
    "verified",
    "verificationCode",
    "passwordResetAt",
    "passwordResetToken",
];

const prisma = new PrismaClient();

export const createUserService = async (input: Prisma.UserCreateInput) => {
    return (await prisma.user.create({
        data: input,
    })) as User;
};

export const findUniqueUserService = async (
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect
    ) => {
    return (await prisma.user.findUnique({
        where,
        select,
    })) as User;
};

export const findUserService = async (
    where: Partial<Prisma.UserWhereInput>,
    select?: Prisma.UserSelect
    ) => {
        return (await prisma.user.findFirst({
        where,
        select,
    })) as User;
};

export const updateUserService = async (
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    select?: Prisma.UserSelect,
    ) => {
        return (await prisma.user.update({ where, data, select})) as User;
};


// TODO: Update to get all the users
export const getAllUsersService = async (
) => {
    return (await prisma.user.findMany());
}

export const signTokens = async (user: Prisma.UserCreateInput) => {
    // 1. Create Session
    redisClient.set(`${user.id}`, JSON.stringify(user),{
        EX: config.get<number>('redisCacheExpiresIn') * 60,
    });

    // 2. Create access and refresh Tokens.
    const access_token = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
        expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    const refresh_token = signJwt({ sub: user.id }, 'refreshTokenPrivateKey', {
        expiresIn: `${config.get<number>('refreshTokenExpiresIn')}m`,
    });

    return {access_token, refresh_token};
}