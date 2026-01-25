import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/product', productRoutes);
app.use('/category', categoryRoutes);
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=app.js.map