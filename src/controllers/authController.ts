import { z } from 'zod';
import bcrypt from 'bcrypt';
import { prisma } from '../database/prisma.js';
import jwt from 'jsonwebtoken';

export const userSignUp = async (req, res) => {
    const usercreationSchema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  });

  const { success, data, error } = usercreationSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: 'valdation failed', data: z.flattenError(error) });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    passwordHash: passwordHash,
  }
  const createdUser = await prisma.user.create({ data: user });

  res.json({
    status: 'success',
    message: 'User created successfully',
    data: { user: createdUser }
  });
};

export const userSignIn = async (req, res) => {
     const userSignInSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
  });
  const { success, data, error } = userSignInSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({ message: 'validation failed', data: z.flattenError(error) });
  }
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    },
  });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ status: 'error', message: 'Invalid password' });
  }
  const secretKey = process.env.JWT_SECRET;

  const acessToken = jwt.sign({ sub: user.id }, secretKey, { expiresIn: '7d' });

  res.json({
    status: 'success',
    message: 'Sign-in successful',
    data: { accessToken: acessToken }
  });
};
export const getCurrentUser = async (req, res) => {
     const user = req.user;
  res.json({
    status: 'success',
    message: 'User profile retrieved successfully',
    data: { user }
  });
};
