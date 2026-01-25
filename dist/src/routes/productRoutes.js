import { Router } from 'express';
import { getAllProduct, getAProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
const router = Router();
router.get('/', getAllProduct);
router.get('/:id', getAProduct);
router.post('/', createProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map