import { Request, Response } from "express";
import { commentRepository } from "../repositories/comment.repository";

export const commentController = {
  async create(req: Request, res: Response) {
    const { content, postId } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      const comment = await commentRepository.create({
        content,
        userId: req.user.id,
        postId,
      });

      return res.status(201).json(comment);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao criar comentário", details: err });
    }
  },

  async findByPost(req: Request, res: Response) {
    const { postId } = req.params;

    try {
      const comments = await commentRepository.findByPost(postId);
      return res.json(comments);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar comentários", details: err });
    }
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;

    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      const deleted = await commentRepository.delete(id, req.user.id);
      if (!deleted) return res.status(403).json({ error: "Comentário não encontrado ou não autorizado." });

      return res.status(204).send();
    } catch (err) {
      return res.status(500).json({ error: "Erro ao excluir comentário", details: err });
    }
  },
};
