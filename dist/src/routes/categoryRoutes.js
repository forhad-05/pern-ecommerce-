import { Router } from 'express';
import { getAllCategory, getACategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
const router = Router();
router.get('/', getAllCategory);
router.get('/:id', getACategory);
router.post('/', createCategory);
router.patch('/:id', updateCategory);
router.delete('/:id', deleteCategory);
export default router;
//# sourceMappingURL=categoryRoutes.js.map