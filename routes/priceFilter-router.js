// pricefilter-router.js
const express = require('express');
const priceFilterRouter = express.Router();
const auth = require('../config/auth');
const priceFilterController = require('../controllers/priceFilterController'); // Updated import

// Route for retrieving all price filters
priceFilterRouter.get('/', auth.isAdmin, priceFilterController.getPriceFilters);

// Route for rendering the form to add a new price filter
priceFilterRouter.get('/add-price-filter', auth.isAdmin, priceFilterController.getAddPriceFilter);

// Route for handling the submission of the form to add a new price filter
priceFilterRouter.post('/add-price-filter', auth.isAdmin, priceFilterController.postAddPriceFilter);

// Route for rendering the form to edit a price filter
priceFilterRouter.get('/edit-price-filter/:id', auth.isAdmin, priceFilterController.getEditPriceFilter);

// Route for handling the submission of the form to edit a price filter
priceFilterRouter.post('/edit-price-filter/:id', auth.isAdmin, priceFilterController.postEditPriceFilter);

// Route for deleting a price filter
priceFilterRouter.get('/delete-price-filter/:id', auth.isAdmin, priceFilterController.deletePriceFilter);

module.exports = priceFilterRouter;
