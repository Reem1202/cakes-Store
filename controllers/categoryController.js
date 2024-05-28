// category-controller.js
const fs = require('fs');
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/category-img');
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

const upload = multer({ storage: storage });

const getCategories = (req, res) => {
  let count;

  Category.count((err, c) => {
    count = c;
    Category.find((err, categories) => {
      if (err) return console.log(err);

      const admin = req.session.admin;
      const success = req.flash('success');
      const error = req.flash('error');

      res.render('admin/category', { categories, count, admin, success, error });
    });
  });
};

const getAddCategory = (req, res) => {
  const admin = req.session.admin;
  const title = "";
  const error = req.flash('error');

  res.render('admin/add-category', { admin, title, error });
};

const postAddCategory = (req, res) => {
  const title = req.body.title.replace(/\s+/g, '-').toUpperCase();
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const image = typeof req.file !== 'undefined' ? req.file.filename : '';

  Category.findOne({ slug: slug }, function (err, category) {
    if (err) return console.log(err);

    if (category) {
      console.log('cat exists');
      fs.unlink('public/images/category-img/' + image, (err) => {
        if (err) console.log(err);
        console.log('old img deleted');
      });

      req.flash('error', 'Category title exists, choose another.');
      return res.redirect('/admin/category/add-category');
    } else {
      const category = new Category({
        title,
        slug,
        image
      });

      category.save(function (err) {
        if (err) return console.log(err);

        Category.find(function (err, categories) {
          if (err) {
            console.log(err);
            console.log('error in finding');
          } else {
            req.app.locals.categories = categories;
          }
        });
      });
    }

    req.flash('success', 'Category added successfully!');
    res.redirect('/admin/category');
  });
};

const getEditCategory = (req, res) => {
  Category.findById(req.params.id, (err, category) => {
    if (err) {
      console.log(err);
      return res.render('admin/404');
    }

    const admin = req.session.admin;
    const error = req.flash('error');

    res.render('admin/edit-category', {
      admin,
      error,
      title: category.title,
      image: category.image,
      id: category._id
    });
  });
};

const postEditCategory = (req, res) => {
  const { title, pimage } = req.body;
  const image = typeof req.file !== 'undefined' ? req.file.filename : '';
  const id = req.params.id;

  Category.findOne({ title: title, _id: { $ne: id } }, (err, category) => {
    if (category) {
      fs.unlink('public/images/category-img/' + image, (err) => {
        if (err) console.log(err);
        console.log('old img deleted');
      });

      req.flash('error', 'Category name already exists!');
      return res.redirect('/admin/category/edit-category/' + id);
    } else {
      if (image !== '') {
        Category.findByIdAndUpdate({ _id: id }, { $set: { title: title, image: image } })
          .then((cat) => {
            cat.save((err) => {
              if (err) return console.log(err);
              fs.unlink('public/images/category-img/' + pimage, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');
              });
              req.flash('success', `Category edited successfully!`);
              res.redirect('/admin/category');
            });
          })
          .catch((err) => console.log(err));
      } else {
        Category.findByIdAndUpdate({ _id: id }, { $set: { title: title, image: pimage } })
          .then((cat) => {
            if (err) return console.log(err);
            cat.save((err) => {
              if (err) return console.log(err);
              req.flash('success', `Category edited successfully!`);
              res.redirect('/admin/category');
            });
          })
          .catch((err) => console.log(err));
      }
    }
  });
};

const deleteCategory = (req, res) => {
  Category.findOne({ _id: req.params.id }, (err, category) => {
    if (err) {
      console.log(err);
      return res.redirect('/admin/*');
    }

    const cat = category.title;

    Product.find({ category: cat }, (err, products) => {
      if (err) {
        console.log(err);
        return res.redirect('/admin/*');
      }

      if (products.length > 0) {
        req.flash('error', 'There are some products in this category. Cannot delete it.');
        return res.redirect('/admin/category');
      } else {
        Category.findById(req.params.id, (err, cat) => {
          if (err) return console.log(err);

          fs.unlink('public/images/category-img/' + cat.image, (err) => {
            if (err) console.log(err);
            console.log('old img deleted');
          });

          Category.deleteOne(cat, () => {
            req.flash('success', `Category deleted successfully!`);
            res.redirect('/admin/category');
          });
        });
      }
    });
  });
};

module.exports = {
  getCategories,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  deleteCategory
};
