const express = require("express");
const walletRouter = express.Router();
const Wallet = require("../models/walletModel");
const Order = require("../models/orderModel");
const auth = require("../config/auth");
walletRouter.get("/", auth.isUser, async (req, res) => {
    try {
        let user = req.session.user;

        // Retrieve wallet balance
        let wallet = await Wallet.findOne({ userId: user._id });
        const balance = wallet ? wallet.amount : 0;

        // Retrieve total amount paid for debit purchases
        const debitOrders = await Order.find({ userId: user._id, status: "placed", paymentMethod: { $ne: "COD" } });
        let totalAmountPaid = 0;
        if (debitOrders) {
            debitOrders.forEach((order) => {
                totalAmountPaid += order.total;
            });
        }

        res.render("user/wallet", { balance: balance, totalAmountPaid: totalAmountPaid, user: req.session.user });
    } catch (error) {
        console.error("Error retrieving wallet balance and total amount paid:", error);
        res.status(500).json({ error: "An error occurred while retrieving wallet balance and total amount paid" });
    }
});

module.exports = walletRouter;