import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} from '../controllers/productController.js';
import { protect, seller } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, seller, createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(protect, seller, deleteProduct)
  .put(protect, seller, updateProduct);

router.route('/:id/reviews')
  .post(protect, createProductReview);

export default router;
