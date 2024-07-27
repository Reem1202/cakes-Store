const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    price: Number,
    sub_total: Number
});

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderDetails: [orderDetailSchema], // Array of order detail objects referencing the Product model
    address: Object,
    total: Number,
    shipping: Number,
    discount: Number,
    amountPaid: Number,
    date: String,
    status: String,
    deliveryDate: String,
    returnRequested: {
        type: Boolean,
        default: false,
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Card'], // Add more options if needed
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;