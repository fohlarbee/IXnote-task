import { Router } from "express";
import { body, param } from "express-validator";
import mongoose from "mongoose";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";

const router = Router();

router.use(authenticate);

const isValidObjectId = (value: string): boolean => {
  return mongoose.Types.ObjectId.isValid(value);
};

router.get("/", getCart);
router.post(
  "/",
  validate([
    body("productId")
      .notEmpty()
      .withMessage("Product ID is required")
      .custom((value) => {
        if (!isValidObjectId(value)) {
          throw new Error("Invalid product ID format");
        }
        return true;
      }),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ]),
  addToCart
);
router.put(
  "/:productId",
  validate([
    param("productId").custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
    body("quantity")
      .isInt({ min: 1 })
      .withMessage("Quantity must be at least 1"),
  ]),
  updateCartItem
);
router.delete(
  "/:productId",
  validate([
    param("productId").custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error("Invalid product ID format");
      }
      return true;
    }),
  ]),
  removeFromCart
);
router.delete("/", clearCart);

export default router;
