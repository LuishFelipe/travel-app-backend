import { PrismaClient, User } from "../../generated/prisma";


const prisma = new PrismaClient();

export const authRepository = {
  findUserByEmail: async (email: string): Promise <User | null> => {
    return prisma.user.findUnique({
      where : { email },
    });
  },
};