// user-product-router.js
const express = require('express');
const userProductRouter = express.Router();
const auth = require('../config/auth');
const userProductController = require('../controllers/userProductController');

  
userProductRouter.get('/', userProductController.getAllProducts);

userProductRouter.get('/:category', userProductController.getProductsByCategory);

userProductRouter.get('/:filter',userProductController.getProductsByFilter)

userProductRouter.get('/vegan', userProductController.getVeganProducts);

userProductRouter.get('/product-details/:id', userProductController.getProductDetails);

module.exports = userProductRouter;
