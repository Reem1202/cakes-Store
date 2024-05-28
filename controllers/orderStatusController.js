// order-status-controller.js
const Order = require("../models/orderModel");

const getOrders = async (req, res) => {
  try {
    const admin = req.session.admin;
    const count = await Order.count();
    const orders = await Order.find({}).populate([
      { path: "userId", model: "User" },
      {
        path: "orderDetails",
        populate: {
          path: "product",
          model: "Product",
        },
      },
    ]);

    const success = req.flash("success");
    const error = req.flash("error");
    const status = ["placed", "shipped", "cancelled", "delivered"];

    res.render("admin/orders", { admin, count, orders, success, error, status });
  } catch (error) {
    console.error(error);
    res.render("admin/404");
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const id = req.params.id;
    console.log(status, id);

    await Order.findById(id).then((order) => {
      order.status = status;
      order.save();
      res.json({ status: true });
    });
  } catch (error) {
    console.error(error);
    res.json({ status: false, error: "Failed to change order status" });
  }
};
const requestReturn = async (req, res) => {
  try {
    const id = req.params.id;

    await Order.findById(id).then((order) => {
      // Assuming you have a specific orderDetailId you want to mark as return requested
      const orderDetailId = req.body.orderDetailId;
      const orderDetail = order.orderDetails.id(orderDetailId);

      // Mark the returnRequested field as true
      orderDetail.returnRequested = true;

      order.save();
      res.json({ status: true });
    });
  } catch (error) {
    console.error(error);
    res.json({ status: false, error: "Failed to request return" });
  }
};
const handleReturnRequest = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const orderDetailId = req.params.orderDetailId;

    await Order.findById(orderId).then((order) => {
      const orderDetail = order.orderDetails.id(orderDetailId);

      // Assuming you have a specific status for a return requested state
      orderDetail.status = 'returnRequested';

      order.save();
      res.json({ status: true });
    });
  } catch (error) {
    console.error(error);
    res.json({ status: false, error: "Failed to handle return request" });
  }
};
// Example server-side code




module.exports = {
  getOrders,
  changeOrderStatus,
  requestReturn,
  handleReturnRequest,
};
