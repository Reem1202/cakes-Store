// profile-router.js
const express = require('express');
const profileRouter = express.Router();
const auth = require('../config/auth');
const profileController = require('../controllers/profileController');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/user-img');
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

profileRouter.get('/', auth.isUser, profileController.getUserProfile);

profileRouter.post('/edit-profile', auth.isUser, upload.single('image'), profileController.postEditProfile);

profileRouter.post('/add-address', auth.isUser, profileController.postAddAddress);

profileRouter.post('/edit-address/:index', auth.isUser, profileController.postEditAddress);

profileRouter.get('/delete-address/:index', auth.isUser, profileController.getDeleteAddress);

profileRouter.post('/change-password', auth.isUser, profileController.postChangePassword);

module.exports = profileRouter;
