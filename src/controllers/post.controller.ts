import { Request, Response } from "express";
import { postRepository } from "../repositories/post.repository";

export const postController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { description, privacity, components } = req.body;

    const post = await postRepository.createPost({
      description,
      privacity,
      userId: req.user.id,
      components,
    });

    return res.status(201).json(post);
  },

  async findAll(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Usuário não autenticado." });

    const posts = await postRepository.getAllPosts(req.user.id);
    res.json(posts);
  },

  async findOne(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;
    const post = await postRepository.getPostById(id, req.user.id);
    if (!post) return res.status(404).json({ error: "Post não encontrado ou não pertence ao usuário." });

    res.json(post);
  },

  async update(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;
    const post = await postRepository.updatePost(id, req.user.id, req.body);
    if (!post) return res.status(404).json({ error: "Post não encontrado ou não pertence ao usuário." });

    res.json(post);
  },

  async remove(req: Request, res: Response) {
    if (!req.user) return res.status(401).json({ error: "Usuário não autenticado." });

    const { id } = req.params;
    const post = await postRepository.deletePost(id, req.user.id);
    if (!post) return res.status(404).json({ error: "Post não encontrado ou não pertence ao usuário." });

    res.status(204).send();
  },
};
