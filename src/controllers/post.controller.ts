import { Request, Response } from "express";
import { postRepository } from "../repositories/post.repository";

export const postController = {
  async create(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    const { description, privacity, components, locations, tags } = req.body;

    const post = await postRepository.createPost({
      description,
      privacity,
      userId: req.user.id,
      components,
      locations,
      tags,
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

  async findByTag(req: Request, res: Response) {
    const { tag } = req.params;
  
    try {
      const posts = await postRepository.getPostByTagName(tag);
  
      if (!posts.length) {
        return res.status(404).json({ message: "Nenhum post encontrado com essa tag." });
      }
  
      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar posts por tag", details: error });
    }
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
