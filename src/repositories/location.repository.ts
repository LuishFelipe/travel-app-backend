import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient();

export const locationRepository = {
  async createLocation(data:{
    country: string;
    region: string;
    city: string;
    description: string;
  }) { 
    return await prisma.location.create({ data });
  },

  async getLocations() {
    return await prisma.location.findMany();
  },

  async getLocationById(id: string) {
    return await prisma.location.findUnique({
      where: { id },
    });
  },

  async getLocationByData(data:{
    country: string;
    region: string;
    city: string;
    description: string;
  }) {
    return await prisma.location.findFirst({
      where: {
        city: data.city,
        region: data.region,
        country: data.country,
        description: data.description,
      },
    });
  },

  async updateLocation(id: string, data: {
    country?: string;
    region?: string;
    city?: string;
    description?: string;
  }) {
    return await prisma.location.update({
      where: { id },
      data,
    });
  },

  async deleteLocation(id: string) {
    return await prisma.location.delete({
      where: { id },
    });
  },

  async getLocationsByCity(city: string) {
    return await prisma.location.findMany({
      where: { city },
    });
  },

  async getLocationsByRegion(region: string) {
    return await prisma.location.findMany({
      where: { region },
    });
  },

  async getLocationsByCountry(country: string) {
    return await prisma.location.findMany({
      where: { country },
    });
  },

  async getLocationsByDescription(description: string) {
    return await prisma.location.findMany({
      where: { description: { contains: description } },
    });
  }
}