const express = require("express");
const orderRouter = express.Router();
const Category = require('../models/categoryModel');
const Wallet = require("../models/walletModel");
const Product = require("../models/productModel");
const Wishlist = require("../models/wishlistModel");
const Cart = require("../models/cartModel");

const auth = require("../config/auth");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");

orderRouter.get("/", auth.isUser, async (req, res) => {
  let user = req.session.user;
  req.session.user.discount = null;

  let count = null;
  if (user) {
      const cartItems = await Cart.findOne({ userId: user._id });
      if (cartItems) {
          count = cartItems.cart.length;
      }
  }

  let wishcount = null;
  if (user) {
      const wishlistItems = await Wishlist.findOne({ userId: user._id });
      if (wishlistItems) {
          wishcount = wishlistItems.wishlist.length;
      }
  }

  try {
      const orders = await Order.find({ userId: user._id })
          .populate([
              {
                  path: "orderDetails",
                  populate: {
                      path: "product",
                      model: "Product",
                  },
              },
          ])
          .sort({ date: -1 });

      res.render("user/orders", { user, count, wishcount, orders });
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send("Internal Server Error");
  }
});
orderRouter.get("/order-details/:id", auth.isUser, async (req, res) => {
  try {
    let user = req.session.user;
    let id = req.params.id;

    let count = null;
    if (user) {
      const cartItems = await Cart.findOne({ userId: user._id });

      if (cartItems) {
        count = cartItems.cart.length;
      }
    }
    let wishcount = null;

    if (user) {
      const wishlistItems = await Wishlist.findOne({ userId: user._id });

      if (wishlistItems) {
        wishcount = wishlistItems.wishlist.length;
      }
    }
    await Order.findById(id)
      .populate([
        {
          path: "orderDetails",
          populate: {
            path: "product",
            model: "Product",
          },
        },
      ])
      .then((order) => {
        res.render("user/order-single-details", {
          user,
          count,
          wishcount,
          order,
        });
      });
  } catch (error) {
    if (error) res.render("user/404");
  }
});
orderRouter.post("/order-details/:id", auth.isUser, async (req, res) => {
  try {
      const orderId = req.params.id;
      const newPaymentMethod = req.body.paymentMethod;

      // Update the payment method of the order with the given orderId
      await Order.findByIdAndUpdate(orderId, {
          paymentMethod: newPaymentMethod
      });

      res.json({ status: true, message: "Payment method updated successfully" });
  } catch (error) {
      console.error("Error updating payment method:", error);
      res.status(500).json({ error: "An error occurred while updating payment method" });
  }
});
orderRouter.get("/order-cancel/:id", auth.isUser, async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status !== "placed") {
      return res.status(400).json({ error: "Order cannot be cancelled" });
    }

    // Check if the order was paid using COD
    if (order.paymentMethod === "COD") {
      // For COD orders, simply update the order status to cancelled
      order.status = "cancelled";
      await order.save();

      return res.json({ status: true, message: "Order cancelled successfully" });
    } else {
      // For non-COD orders, refund the amount to the wallet balance
      const userId = order.userId;
      const amountPaid = order.amountPaid;

      const wallet = await Wallet.findOne({ userId: userId });
      if (wallet) {
        wallet.amount += amountPaid; // Refund the amount to existing wallet balance
      } else {
        // If wallet doesn't exist, create a new wallet entry
        await Wallet.create({
          userId: userId,
          amount: amountPaid,
          transactionType: 'credit',
          timestamp: new Date()
        });
      }
      await wallet.save();

      // Update the order status to cancelled
      order.status = "cancelled";
      await order.save();

      return res.json({ status: true, message: "Order cancelled successfully" });
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ error: "An error occurred while cancelling order" });
  }
});
module.exports = orderRouter;