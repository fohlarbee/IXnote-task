import { Router } from "express";
import { body, param } from "express-validator";
import mongoose from "mongoose";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from "../controllers/productController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";

const router = Router();

const isValidObjectId = (value: string): boolean => {
  return mongoose.Types.ObjectId.isValid(value);
};

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get(
  "/:id",
  validate([
    param("id").custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
  ]),
  getProduct
);
router.post(
  "/",
  authenticate,
  validate([
    body("name").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("category").trim().notEmpty(),
    body("stock").optional().isInt({ min: 0 }),
  ]),
  createProduct
);
router.put(
  "/:id",
  authenticate,
  validate([
    param("id").custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
    body("name").optional().trim().notEmpty(),
    body("description").optional().trim().notEmpty(),
    body("price").optional().isFloat({ min: 0 }),
    body("category").optional().trim().notEmpty(),
    body("stock").optional().isInt({ min: 0 }),
  ]),
  updateProduct
);
router.delete(
  "/:id",
  authenticate,
  validate([
    param("id").custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
  ]),
  deleteProduct
);

export default router;
