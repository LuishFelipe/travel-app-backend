import { Request, Response } from "express";
import { authRepository } from "../repositories/auth.repository";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if(!email || !password){
    res.status(400).json({ message: "Email e senha sao obrigatorios!"});
    return;
  }

  const user = await authRepository.findUserByEmail(email);
  if(!user){
    res.status(401).json({ message: "Credenciais inválidas!"});
    return;
  }

  const validPassword = await argon2.verify(user.password, password);
  if(!validPassword){
    res.status(401).json({ message: "Credenciais inválida!" });
    return;
  }

  const token = jwt.sign({
      userId: user.id,
      nome: user.username,
      email: user.email 
    },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "8h" }
  );

  res.json({ message: 'Login realizado com sucesso!', token });
}