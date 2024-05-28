// profile-controller.js
const fs = require('fs');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Address = require('../models/addressModel');
const Cart = require("../models/cartModel");
const Wishlist = require("../models/wishlistModel");

const securePassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
};

const getUserProfile = async (req, res) => {
    const user = req.session.user;
    const id = user._id;
    req.session.user.discount = null;

    const userData = await User.findOne({ _id: id });
    const address = await Address.findOne({ userId: id });
    const error = req.flash('error');
    const success = req.flash('success');
    let count = null;

    if (user) {
        const cartItems = await Cart.findOne({ userId: user._id });

        if (cartItems) {
            count = cartItems.cart.length;
        }
    }

    let wishcount = null;

    if (user) {
        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }

    res.render('user/user-profile', { user: userData, address, success, error, count, wishcount });
};

const postEditProfile = async (req, res) => {
    const user = req.session.user;
    const id = user._id;
    const { name, email, contact, pimage } = req.body;
    const image = typeof req.file !== "undefined" ? req.file.filename : "";

    User.findById(id, (err, user) => {
        if (err) console.log(err);

        if (image === "") {
            user.name = name;
            user.image = pimage;
            user.contact = contact;
            user.save(() => {
                res.redirect('/profile');
            });
        } else {
            user.name = name;
            user.image = image;
            user.contact = contact;

            user.save(() => {
                if (image !== "") {
                    console.log('image is already there');

                    if (user.image !== "") {
                        console.log('image updated');

                        fs.unlink('public/images/user-img/' + pimage, (err) => {
                            if (err) console.log(err);
                            console.log('old img deleted');
                        });
                    }
                }
                res.redirect('/profile');
            });
        }
    });
};

const postAddAddress = async (req, res) => {
    const user = req.session.user;
    const id = user._id;
    const { name, housename, landmark, street, pin, contact, district, state, country } = req.body;
    const addressbook = await Address.findOne({ userId: id });

    if (addressbook.details.length > 0) {
        console.log('addressbook exists');
        await Address.findOneAndUpdate({ userId: id }, {
            $push: {
                details: {
                    name, housename,
                    landmark, street, pin, contact, district, state, country
                }
            }
        });
    } else {
        console.log('addressbook doesnt exist');
        await Address.findOneAndUpdate({ userId: id }, {
            $push: {
                details: {
                    name, housename,
                    landmark, street, pin, contact, district, state, country, select: true
                }
            }
        });

        console.log('default address saved');
    }
    res.redirect('back');
};

const postEditAddress = async (req, res) => {
    const user = req.session.user;
    const index = req.params.index;
    const { name, housename, landmark, street, pin, contact, district } = req.body;

    await Address.findOne({ userId: user._id }).then((address) => {
        address.details[index].name = name;
        address.details[index].housename = housename;
        address.details[index].landmark = landmark;
        address.details[index].street = street;
        address.details[index].pin = pin;
        address.details[index].contact = contact;
        address.details[index].district = district;

        address.save();

        res.redirect('back');
    });
};

const getDeleteAddress = async (req, res) => {
    const index = req.params.index;
    const user = req.session.user;

    await Address.findOne({ userId: user._id }).then((address) => {
        const ad = address.details[index];
        console.log(ad);
        address.details.pull(ad);
        address.save();
        res.redirect('back');
    });
};

const postChangePassword = async (req, res) => {
    const user = req.session.user;
    console.log(user.password);
    const id = user._id;
    const { password, npassword } = req.body;
    console.log(req.body);
    const spassword = await securePassword(password);
    console.log(spassword);

    const snpassword = await securePassword(npassword);
    console.log(snpassword);

    const passwordMatch = await bcrypt.compare(spassword, user.password);
    console.log(passwordMatch);

    if (passwordMatch) {
        await User.findByIdAndUpdate(id, { $set: { password: snpassword } });
        req.flash('success', 'Your password updated successfully.');
        res.redirect('/profile');
    } else {
        req.flash('error', 'Current password is wrong!');
        res.redirect('/profile');
    }
};

module.exports = {
    getUserProfile,
    postEditProfile,
    postAddAddress,
    postEditAddress,
    getDeleteAddress,
    postChangePassword,
};
