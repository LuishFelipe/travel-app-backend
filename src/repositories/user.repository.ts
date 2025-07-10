import { PrismaClient, User } from "../../generated/prisma";

const prisma = new PrismaClient();

export const userRepository = {
  createUser: async (data: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    return await prisma.user.create({ data });
  },

  getUserById: async (id: string): Promise<User|null> => {
    return await prisma.user.findUnique({ where: { id } });
  },

  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany();
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    return await prisma.user.update({
      where: { id },
      data,
    });
  },

  deleteUser: async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    return await prisma.user.delete({ where: { id } });
  }
};
