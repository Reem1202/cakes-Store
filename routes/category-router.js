// category-router.js
const express = require('express');
const categoryRouter = express.Router();
const auth = require('../config/auth');

const multer = require('multer');
const upload = multer({ dest: 'public/images/category-img' }); 
const categoryController = require('../controllers/categoryController');

categoryRouter.get('/', auth.isAdmin, categoryController.getCategories);

categoryRouter.get('/add-category', auth.isAdmin, categoryController.getAddCategory);

categoryRouter.post('/add-category', auth.isAdmin,  upload.single('image'),categoryController.postAddCategory);

categoryRouter.get('/edit-category/:id', auth.isAdmin, categoryController.getEditCategory);

categoryRouter.post('/edit-category/:id', auth.isAdmin,  upload.single('image'),categoryController.postEditCategory);

categoryRouter.get('/delete-category/:id', auth.isAdmin, categoryController.deleteCategory);

module.exports = categoryRouter;
