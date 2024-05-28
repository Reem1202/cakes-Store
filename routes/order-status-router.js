// order-status-router.js
const express = require("express");
const orderStatusRouter = express.Router();
const auth = require("../config/auth");
const orderStatusController = require("../controllers/orderStatusController");

orderStatusRouter.get("/", auth.isAdmin, orderStatusController.getOrders);

orderStatusRouter.post(
  "/change-status/:id",
  auth.isAdmin,
  orderStatusController.changeOrderStatus
);
orderStatusRouter.post('/admin/orders/:id/request-return', orderStatusController.requestReturn);
orderStatusRouter.post('/admin/orders/:orderId/request-return/:orderDetailId', orderStatusController.handleReturnRequest);

module.exports = orderStatusRouter;
