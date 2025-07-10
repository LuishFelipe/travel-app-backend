import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const tagRepository = {
  async findByName(name: string) {
    return await prisma.tag.findUnique({ where: { name } });
  },

  async create(name: string) {
    return await prisma.tag.create({ data: { name } });
  },

  async findOrCreate(name: string) {
    const existing = await prisma.tag.findUnique({ where: { name } });
    if (existing) return existing;

    return await prisma.tag.create({ data: { name } });
  },

  async findAll() {
    return await prisma.tag.findMany();
  }
};
