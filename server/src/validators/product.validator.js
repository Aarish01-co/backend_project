import { body, param } from "express-validator";
import { handleValidationErrors } from "../middleware/validate.middleware.js";

export const validateCreateProduct = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),
  body("imageUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Please enter a valid URL for the product image"),
  handleValidationErrors
];

export const validateUpdateProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),
  body("imageUrl")
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage("Please enter a valid URL for the product image"),
  handleValidationErrors
];

export const validateProductId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID format"),
  handleValidationErrors
];
