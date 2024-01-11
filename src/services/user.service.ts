import { registerUserHandler } from './../controllers/auth.controllers';
import { PrismaClient, Prisma, User } from "@prisma/client";

export const excludedFields = ['password', 'verified', 'verificationCode']; 

const prisma = new PrismaClient();


export const createUserService = {
    /**
     * Creates a new User in the database.
     * @param newUserData - The data for the new user.
     * @returns A promise that resolves to the created product.
     * @throws {Error} Throws an error if there's an issue creating the user.
     */

    registerUserHandler: async (newUserData: Prisma.UserCreateInput): Promise<User> => {
        try {
          // Create a new user in the database using Prisma
        const createdUser = await prisma.user.create({
        data: newUserData,
        });

        return createdUser;
    } catch (error:any) {
        // Handle any errors that occur during user creation
        throw new Error(`Error creating user: ${error.message}`);
    }
    },
};
