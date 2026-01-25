import express from 'express';
import { z }  from 'zod'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; 
import {prisma} from './prisma.js';
import { fi } from 'zod/locales';
const app = express();


app.use(express.json());

 app.post('/auth/sign-up' ,async (req, res) => {
    
    const usercreationSchema = z.object({
      firstName: z.string().min(3),
      lastName: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
    });
    
    const { success, data, error } = usercreationSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: 'valdation failed', data: z.flattenError(error)});
    }
    
   const passwordHash = await bcrypt.hash(data.password, 10);

    const user = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash: passwordHash,  
    }
    const createdUser = await prisma.user.create({data: user});

  res.json ({  status:'success',
     message:'User created successfully',
      data: { user :createdUser } });
  });
  app.post('/auth/sign-in', async (req, res) => {
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
      return res.status(401).json({ status:'error', message: 'Invalid password' });
    }
    const secretKey = process.env.JWT_SECRET;

    const acessToken = jwt.sign({sub: user.id}, secretKey, { expiresIn: '7d' });

    res.json({ 
      status:'success',
      message: 'Sign-in successful', 
      data: { accessToken: acessToken } 
    });
  });
  app.get('/auth/me', async (req, res) => {
   const authHeader  = req.headers.authorization;  
    if (!authHeader) {
      return res.status(401).json({  status: 'error', message: 'Access token missing' });
    }
    const accessToken = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET;

    jwt.verify(accessToken, secretKey, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ status: 'error', message: 'Invalid access token' });
      }
      const userId = decoded.sub;
      const user = await prisma.user.findUnique({
        where: { 
          id: userId 
        },
        omit: { passwordHash: true },
      });
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }
      res.json({
         status: 'success', 
         message: 'User retrieved successfully',
          data: { user }
         });
    } );
  });
  
  app.get('/users', async (req, res) => {
     const users = await prisma.user.findMany({
      omit: {
        passwordHash: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json({  status:'success', 
       messsage: 'Users retrieved successfully',
        data:{users} });
  });

  app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userGetSchema = z.object({
      id: z.uuid(),
    });
    const { success, error } = userGetSchema.safeParse({ 
      id: userId,
    });
    if (!success) {
      return res.status(400).json({ message: 'validation failed', data: z.flattenError(error) });
    }
    const user = await prisma.user.findUnique({
      where: { 
        id: userId
      },
      omit: { passwordHash: true },
    });
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ status: 'success', 
      message: 'User retrieved successfully', 
      data: { user } 
    });
  });

  app.patch('/users/:id', async (req, res) => {
    const userId = req.params.id;
    const userUpdateSchema = z.object({
      id:z.uuid(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    });
    const { success, data, error } = userUpdateSchema.safeParse({
      id: userId,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    if (!success) {
      return res.status(400).json({ message: 'validation failed', data: z.flattenError(error) });
    }
    const user ={
      firstName: data.firstName,
      lastName: data.lastName,
    };
    
    const updatedUser = await prisma.user.update({
      where: { 
        id: userId
       },
      data: user,
      omit: { passwordHash: true },
      
      
  });
  res.json({  status:'success', 
     message: 'User updated successfully', 
     data : {user :updatedUser }});
});
app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const userDeleteSchema = z.object({
    id: z.uuid(),
  });
  const { success, error } = userDeleteSchema.safeParse({ 
    id: userId 
  });
  if (!success) {
    return res.status(400).json({ message: 'validation failed', data: z.flattenError(error) });
  } 
  const user = await prisma.user.findUnique({
    where: { 
      id: userId
      },  
  });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


  const deletedUser = await prisma.user.delete({
    where: { 
      id: userId
     },
    omit: 
    { 
      passwordHash: true 
    },
  });
  res.json({ status: 'success', message: 'User deleted successfully', data: { user: deletedUser } });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});      
