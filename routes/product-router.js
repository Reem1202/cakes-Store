// product-router.js
const express = require('express');
const productRouter = express.Router();
const auth = require('../config/auth');
const productController = require('../controllers/productController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/product-img');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: storage });

productRouter.get('/', auth.isAdmin, productController.getProducts);

productRouter.get('/add-product', auth.isAdmin, productController.getAddProduct);

productRouter.post('/add-product', upload.single('image'), productController.postAddProduct);

productRouter.get('/edit-product/:id', auth.isAdmin, productController.getEditProduct);

productRouter.post('/edit-product/:id', upload.single('image'), productController.postEditProduct);

productRouter.post('/edit-product/add-gallery/:id', upload.array('images', 5), productController.postAddGallery);

productRouter.get('/edit-product/delete-gallery/:id/:img', auth.isAdmin, productController.getDeleteGallery);

productRouter.get('/delete-product/:id', auth.isAdmin, productController.getDeleteProduct);


module.exports = productRouter;
