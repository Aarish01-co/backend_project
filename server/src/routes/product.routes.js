import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controller/product.controller.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId
} from "../validators/product.validator.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, validateCreateProduct, createProduct);
router.get("/", getProducts);
router.get("/:id", validateProductId, getProductById);
router.put("/:id", authenticate, validateUpdateProduct, updateProduct);
router.delete("/:id", authenticate, validateProductId, deleteProduct);

export default router;
