import { PrismaClient, Prisma, User } from "@prisma/client";

const prisma = new PrismaClient();


export const findUser = async (
    where: Partial<Prisma.UserWhereInput>,
    select?: Prisma.UserSelect
) => {
    return (await prisma.user.findFirst({
        where,
        select,
    })) as User;
}; 