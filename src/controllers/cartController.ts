import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { AuthRequest } from "../middleware/auth";
import { AppError } from "../middleware/errorHandler";

export const getCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let cart = await Cart.findOne({ user: req.user?.id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user?.id, items: [] });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      const error: AppError = new Error("Please provide productId and quantity");
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error: AppError = new Error("Invalid product ID format");
      error.statusCode = 400;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product) {
      const error: AppError = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < quantity) {
      const error: AppError = new Error("Insufficient stock");
      error.statusCode = 400;
      throw error;
    }

    let cart = await Cart.findOne({ user: req.user?.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user?.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      const error: AppError = new Error("Quantity must be at least 1");
      error.statusCode = 400;
      throw error;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error: AppError = new Error("Invalid product ID format");
      error.statusCode = 400;
      throw error;
    }

    const cart = await Cart.findOne({ user: req.user?.id });
    if (!cart) {
      const error: AppError = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      const error: AppError = new Error("Item not found in cart");
      error.statusCode = 404;
      throw error;
    }

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      const error: AppError = new Error("Insufficient stock");
      error.statusCode = 400;
      throw error;
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error: AppError = new Error("Invalid product ID format");
      error.statusCode = 400;
      throw error;
    }

    const cart = await Cart.findOne({ user: req.user?.id });
    if (!cart) {
      const error: AppError = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?.id });
    if (!cart) {
      const error: AppError = new Error("Cart not found");
      error.statusCode = 404;
      throw error;
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

