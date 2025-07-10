import { Request, Response } from 'express';
import { userRepository } from '../repositories/user.repository';
import argon2 from "argon2";

export const userController = {
  async create(req: Request, res: Response) {
    const { password, ...userData } = req.body;

    if (!password){
      return res.status(400).json({ error: "Senha obrigatória" });
    }

    const hashedPassword = await argon2.hash(password);
    const user = await userRepository.createUser({ ...userData, password: hashedPassword });

    return res.status(201).json(user);
  },

  async me(req: Request, res: Response) {
    if(!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }
    const user = await userRepository.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const { password, ...userData } = user;
    return res.json(userData);
  },

  async findAll(req: Request, res: Response) {
    const users = await userRepository.getAllUsers();
    res.json(users);
  },

  async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const user = await userRepository.getUserById(id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { password, ...updateData } = req.body;

    if (!req.user || req.user.id !== id) {
      return res.status(403).json({ error: 'Ação não permitida.' });
    }

    if (password) {
      updateData.password = await argon2.hash(password);
    }

    const updatedUser = await userRepository.updateUser(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    return res.status(200).json(updatedUser);
  },

  async remove(req: Request, res: Response) {
    const { id } = req.params;
  
    if (!req.user || req.user.id !== id) {
      return res.status(403).json({ error: 'Ação não permitida.' });
    }
  
    const deletedUser = await userRepository.deleteUser(id);
  
    if (!deletedUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  
    return res.status(204).send();
  }
};
