const mongoose = require('mongoose');
const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: Number,
    transactionType: String, // e.g., 'credit', 'debit'
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Wallet = mongoose.model('Wallet', walletSchema);
module.exports = Wallet;