import { Prisma, PrismaClient, Session } from "@prisma/client";

const prisma = new PrismaClient();


// Update the Session Table based on the entries passed.
export const UpdateUserSessionService = async (input:Prisma.SessionCreateInput) => {
    return (await prisma.session.create({
        data: input,
    })) as Session;
};