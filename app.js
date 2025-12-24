import express from 'express';
import {z}  from 'zod'; 
import bcrypt from 'bcrypt';
//  import {prisma} from './prisma.js';
const app = express();


app.use(express.json());

 app.post('/auth/sign-up' ,async (req, res) => {
    
    const usercreationSchema = z.object({
      firstname: z.string().min(3),
      lastname: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
    });
    
    const { success, data, error } = usercreationSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: 'valdation failed', data: z.flattenError(error)});
    }
    
   const passwordHash = await bcrypt.hash(data.password, 10);

    const user = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      passwordHash: passwordHash,  
    }

    res.json ({user: user })
  });

app.listen(3002, () => {
  console.log('Server is running on port 3000');
});