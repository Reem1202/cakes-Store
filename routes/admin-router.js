const express = require('express');
const adminRouter = express.Router();
const auth = require('../config/auth');
const multer = require('multer');
const upload = multer({ dest: 'public/images/banner-img' }); // Update destination
const adminController = require('../controllers/adminController');

// Admin routes
adminRouter.get('/', adminController.renderLogin);
adminRouter.post('/', adminController.login);
adminRouter.get('/dashboard', auth.isAdmin, adminController.renderDashboard);
adminRouter.get('/chart', auth.isAdmin,adminController.chartData);
adminRouter.get('/logout', adminController.logout);
adminRouter.get('/banner', auth.isAdmin, adminController.renderBanners);
adminRouter.get('/banner/add-banner', auth.isAdmin, adminController.renderAddBanner);
adminRouter.post('/banner/add-banner', upload.single('banner'), adminController.addBanner);
adminRouter.get('/banner/edit-banner/:id', auth.isAdmin, adminController.renderEditBanner);
adminRouter.post('/banner/edit-banner/:id', upload.single('banner'), adminController.editBanner);
adminRouter.get('/banner/delete/:id', auth.isAdmin, adminController.deleteBanner);
adminRouter.get('/users', auth.isAdmin, adminController.renderUsers);
adminRouter.get('/users/block/:id', auth.isAdmin, adminController.blockUser);
adminRouter.get('/users/unblock/:id', auth.isAdmin, adminController.unblockUser);
adminRouter.get('/not', adminController.renderNotFound);


module.exports = adminRouter;
