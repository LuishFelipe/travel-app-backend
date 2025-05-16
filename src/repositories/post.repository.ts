import { PrismaClient, Post } from "../../generated/prisma";

const prisma = new PrismaClient();

interface ComponentInput {
  order: number;
  type: "TEXT" | "PHOTO" | "VIDEO"; // só para lógica da aplicação
  content: any;
}

interface CreatePostInput {
  description: string;
  privacity: boolean;
  userId: string;
  components: ComponentInput[];
}

export const postRepository = {
  async createPost({ description, privacity, userId, components }: CreatePostInput) {
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: {
          description,
          privacity,
          likeNumber: 0,
          userId,
        },
      });

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

  async updatePost(postId: string, userId: string, data: Partial<Post>): Promise<Post | null> {
    const post = await prisma.post.findFirst({ where: { id: postId, userId } });
    if (!post) return null;

    return await prisma.post.update({
      where: { id: postId },
      data,
    });
  },

  async deletePost(postId: string, userId: string): Promise<Post | null> {
    const post = await prisma.post.findFirst({ where: { id: postId, userId } });
    if (!post) return null;

    return await prisma.post.delete({ where: { id: postId } });
  },
};
