import { PrismaClient, Comment } from "../../generated/prisma";

const prisma = new PrismaClient();

interface CreateCommentInput {
  content: string;
  userId: string;
  postId: string;
}

export const commentRepository = {
  async create(data: CreateCommentInput): Promise<Comment> {
    return await prisma.comment.create({ data });
  },

  async findByPost(postId: string): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { postId },
      include: { 
        user: {
          select: {
            username: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async delete(commentId: string, userId: string): Promise<Comment | null> {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        post: true
      },
    });

    if (!comment) return null;  

    const isAuthor = comment.userId === userId;
    const isPostAuthor = comment.post.userId === userId;
    if (!isAuthor && !isPostAuthor) return null

    return await prisma.comment.delete({ where: { id: commentId } });
  },
};
