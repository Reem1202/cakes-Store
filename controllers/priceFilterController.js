// pricefilter-controller.js
const PriceFilter = require('../models/priceFilterModel');
const Product = require('../models/productModel');
const { validationResult } = require('express-validator');

const getPriceFilters = async (req, res) => {
  try {
      const PriceFilters = await PriceFilter.find();
      console.log('Price Filters:', PriceFilters); // Add this console log
      const admin = req.session.admin;
      const success = req.flash('success');
      const error = req.flash('error');

      let count = null;
      const user = req.session.user;
      if (user) {
          const cartItems = await Cart.findOne({ userId: user._id });
          if (cartItems) {
              count = cartItems.cart.length;
          }
      }

      res.render('admin/price-filters', { PriceFilters, admin, success, error, count });
  } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Error');
  }
};
const getAddPriceFilter = (req, res) => {
  const admin = req.session.admin;
  const title = "";
  const error = req.flash('error');

  res.render('admin/add-price-filter', { admin, title, error });
};

const postAddPriceFilter = (req, res) => {
  const title = req.body.title.toUpperCase();

  // Check if the title is empty
  if (!title.trim()) {
    req.flash('error', 'Please provide a valid title.');
    return res.redirect('/admin/price-filters/add-price-filter');
  }

  // Check if a price filter with the same title already exists
  PriceFilter.findOne({ title: title }, (err, existingPriceFilter) => {
    if (err) {
      console.log(err);
      req.flash('error', 'An error occurred while checking the database.');
      return res.redirect('/admin/price-filters/add-price-filter');
    }

    if (existingPriceFilter) {
      req.flash('error', 'Price filter title already exists. Please choose another.');
      return res.redirect('/admin/price-filters/add-price-filter');
    }

    // Create a new price filter
    const newPriceFilter = new PriceFilter({ title: title });

    // Save the new price filter to the database
    newPriceFilter.save((err) => {
      if (err) {
        console.log(err);
        req.flash('error', 'An error occurred while saving the price filter.');
        return res.redirect('/admin/price-filters/add-price-filter');
      }

      req.flash('success', 'Price filter added successfully!');
      res.redirect('/admin/price-filters');
    });
  });
};
const getEditPriceFilter = (req, res) => {
  PriceFilter.findById(req.params.id, (err, priceFilter) => {
    if (err) {
      console.log(err);
      return res.render('admin/404');
    }

    const admin = req.session.admin;
    const error = req.flash('error');

    res.render('admin/edit-price-filter', {
      admin,
      error,
      title: priceFilter.title,
      id: priceFilter._id
    });
  });
};

const postEditPriceFilter = (req, res) => {
  const { title } = req.body;
  const id = req.params.id;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array()[0].msg);
    return res.redirect('/admin/price-filters/edit-price-filter/' + id);
  }

  PriceFilter.findOne({ title: title, _id: { $ne: id } }, (err, priceFilter) => {
    if (priceFilter) {
      req.flash('error', 'Price filter name already exists!');
      return res.redirect('/admin/price-filters/edit-price-filter/' + id);
    } else {
      PriceFilter.findByIdAndUpdate(id,{ $set: { title: title } })
        .then(() => {
          req.flash('success', 'Price filter edited successfully!');
          res.redirect('/admin/price-filters');
        })
        .catch((err) => console.log(err));
    }
  });
};

const deletePriceFilter = (req, res) => {
  PriceFilter.findById(req.params.id, (err, priceFilter) => {
    if (err) {
      console.log(err);
      return res.redirect('/admin/*');
    }

    const filter = priceFilter.title;

    Product.find({ priceFilter: filter }, (err, products) => {
      if (err) {
        console.log(err);
        return res.redirect('/admin/*');
      }

      if (products.length > 0) {
        req.flash('error', 'There are some products using this price filter. Cannot delete it.');
        return res.redirect('/admin/price-filters');
      } else {
        PriceFilter.findByIdAndDelete(req.params.id, (err) => {
          if (err) console.log(err);
          req.flash('success', 'Price filter deleted successfully!');
          res.redirect('/admin/price-filters');
        });
      }
    });
  });
};

module.exports = {
  getPriceFilters,
  getAddPriceFilter,
  postAddPriceFilter,
  getEditPriceFilter,
  postEditPriceFilter,
  deletePriceFilter
};