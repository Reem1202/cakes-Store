const mongoose = require('mongoose');


const priceFilterSchema = new mongoose.Schema({
    title: String,

});


const PriceFilter= mongoose.model('PriceFilter', priceFilterSchema);


module.exports = PriceFilter;
