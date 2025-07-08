import { PrismaClient, Post } from "../../generated/prisma";
import { locationRepository } from "./location.repository";

const prisma = new PrismaClient();

interface ComponentInput {
  order: number;
  type: "TEXT" | "PHOTO" | "VIDEO"; // só para lógica da aplicação
  content: any;
}

interface LocationInput {
  country: string;
  region: string;
  city: string;
  description: string;
}

interface CreatePostInput {
  description: string;
  privacity: boolean;
  userId: string;
  components: ComponentInput[];
  locations?: LocationInput[];
}

interface UpdatePostInput {
  description?: string;
  privacity?: boolean;
  components?: ComponentInput[];
  locations?: LocationInput[];
}

export const postRepository = {
  async createPost({ description, privacity, userId, components, locations }: CreatePostInput) {
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          description,
          privacity,
          likeNumber: 0,
          userId,
        },
      });

      if(locations && locations.length > 0) {
        console.log("Locations provided:", locations);
        for (const location of locations) {
          const existingLocation = await locationRepository.getLocationByData(location);
          if (existingLocation) {
            await tx.postLocation.create({
              data: {
                postId: post.id,
                locationId: existingLocation.id,
              },
            });
            console.log("Creating Postlocation ", existingLocation.id);
          } else {
            const newLocation = await locationRepository.createLocation(location);
            console.log("Creating Postlocation ", newLocation.id);
            await tx.postLocation.create({
              data: {
                postId: post.id,
                locationId: newLocation.id,
              },
            });
          }
        }
      }
      
      for (const component of components) {
        const { order, type, content } = component;

        const postComponent = await tx.postComponent.create({
          data: {
            order,
            postId: post.id,
          },
        });

        switch (type) {
          case "TEXT":
            await tx.text.create({
              data: {
                content: content.content,
                postComponentId: postComponent.id,
              },
            });
            break;

          case "PHOTO":
            await tx.photo.create({
              data: {
                url: content.url,
                caption: content.caption,
                postComponentId: postComponent.id,
              },
            });
            break;

          case "VIDEO":
            await tx.video.create({
              data: {
                url: content.url,
                duration: content.duration,
                postComponentId: postComponent.id,
              },
            });
            break;

          default:
            throw new Error(`Tipo de componente inválido: ${type}`);
        }
      }

      return post;
    });
  },

  async getAllPosts(userId: string): Promise<Post[]> {
    return await prisma.post.findMany({
      where: { userId },
      include: {
        postComponents: {
          include: {
            text: true,
            photo: true,
            video: true,
          },
        },
      },
    });
  },

  async getPostById(postId: string, userId: string): Promise<Post | null> {
    return await prisma.post.findFirst({
      where: { id: postId, userId },
      include: {
        postComponents: {
          include: {
            text: true,
            photo: true,
            video: true,
          },
        },
      },
    });
  },

  async updatePost(postId: string, userId: string, data: UpdatePostInput): Promise<Post | null> {
    return await prisma.$transaction(async (tx) => {
      const post = await prisma.post.findFirst({ where: { id: postId, userId } });
      if (!post) return null;
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          description: data.description ?? post.description,
          privacity: data.privacity ?? post.privacity,
        },
      });

      if (data.components) {
        const oldComponents = await tx.postComponent.findMany({ where: { postId } });

        for (const component of oldComponents) {
          await tx.text.deleteMany({ where: { postComponentId: component.id }, });
          await tx.photo.deleteMany({ where: { postComponentId: component.id }, });
          await tx.video.deleteMany({ where: { postComponentId: component.id }, });
        }

        await tx.postComponent.deleteMany({ where: { postId } });
        for (const { order, type, content } of data.components) {
          const newComponent = await tx.postComponent.create({
            data: {
              order,
              postId,
            },
          });  

          switch (type) {
            case "TEXT":
              await tx.text.create({
                data: {
                  content: content.content,
                  postComponentId: newComponent.id,
                },
              });
              break;

            case "PHOTO":
              await tx.photo.create({
                data: {
                  url: content.url,
                  caption: content.caption,
                  postComponentId: newComponent.id,
                },
              });
              break;
            case "VIDEO":
              await tx.video.create({
                data: {
                  url: content.url,
                  duration: content.duration,
                  postComponentId: newComponent.id,
                },
              });
              break;
            default:
              throw new Error(`Tipo de componente inválido: ${type}`);
          }
        }
      }

      if (data.locations && data.locations.length > 0) {
        await tx.postLocation.deleteMany({ where: { postId } });

        for (const location of data.locations) {
          const existingLocation = await locationRepository.getLocationByData(location);
          if (existingLocation) {
            await tx.postLocation.create({
              data: {
                postId,
                locationId: existingLocation.id,
              },
            });
          } else {
            const newLocation = await locationRepository.createLocation(location);
            await tx.postLocation.create({
              data: {
                postId,
                locationId: newLocation.id,
              },
            });
          }
        }
      }
      return updatedPost
      // return {
      //   ...updatedPost,
      //   description: updatedPost.description ?? undefined,
      // };
    });
  },

  async deletePost(postId: string, userId: string): Promise<Post | null> {
    const post = await prisma.post.findFirst({ where: { id: postId, userId } });
    if (!post) return null;

    return await prisma.post.delete({ where: { id: postId } });
  },
};
