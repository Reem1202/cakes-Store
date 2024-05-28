// product-controller.js
const fs = require('fs');
const PriceFilter=require('../models/priceFilterModel')
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');


const getProducts = async (req, res) => {
    try {
        const count=await Product.countDocuments();
        const products=await Product.find();

        
                const admin = req.session.admin;
                const success = req.flash('success');
                console.log('Count',count)
                res.render('admin/products', { products, count, success, admin });
            
    } catch (error) {
        console.error(error);
        const admin = req.session.admin;
        const success = req.flash('success');
        res.render('admin/products', { products:[], count:0, success, admin });
    
      
    }
    let filter = {};

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.price) {
        let prices = req.query.price.split('-');
        if (prices.length === 2) {
            filter.price = { $gte: prices[0], $lte: prices[1] };
        } else {
            filter.price = { $gte: prices[0] };
        }
    }

    Product.find(filter, (err, pro) => {
        if (err) return console.log(err);
        res.render('admin/products', { pro });
    });
}
const getAddProduct = async (req, res) => {
    try {
        const title = '';
        const description = '';
        const price = '';
        const [categories, priceFilters] = await Promise.all([
            Category.find().exec(),
            PriceFilter.find().exec() // Assuming you have a PriceFilter model
        ]);
            const admin = req.session.admin;
            const error = req.flash('error');
            res.render('admin/add-product', {
                admin,
                error,
                title,
                description,
                categories,
                priceFilters,
                price,

            });
        
    } catch (error) {
        console.error(error);
        res.render('admin/404');
    }
};

const postAddProduct = async (req, res) => {
    const { description, price, category, special, vegan, priceFilter} = req.body;
    const title = req.body.title.toUpperCase();
    const slug = req.body.title.toLowerCase();
    const image = typeof req.file !== "undefined" ? req.file.filename : "";

    Product.findOne({ slug, category }, (err, product) => {
        if (err) {
            console.log('error in cat find');
            return console.log(err);
        }
        if (product) {
            console.log("pro exists");
            fs.unlink('public/images/product-img/' + image, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');
            });
            req.flash('error', 'Product exists, choose another.');
            return res.redirect('/admin/product/add-product');
        } else {
            const price2 = parseFloat(price).toFixed(2);
            const newProduct = new Product({
                title,
                slug,
                description,
                price: price2,
                category,
                image,
                images: [],
                special,
                vegan,
                priceFilter
            });

            newProduct.save((err) => {
                if (err) {
                    return console.log(err);
                }

                Product.find((err, products) => {
                    if (err) {
                        console.log(err);
                        console.log('error in finding');

                    } else {
                        req.app.locals.products = products;
                    }
                });
            });
        }

        req.flash('success', 'Product added!');
        res.redirect('/admin/product');
    });
};

    const getEditProduct = async (req, res) => {
        try {
            const categories = await Category.find({});
            const product = await Product.findById(req.params.id);
    
            const admin = req.session.admin;
            const error = req.flash('error');
            const success = req.flash('success');
            let vegan = true;
            let special = true;
    
            if (product.vegan == null || product.vegan == false) vegan = false;
            if (product.special == null || product.special == false) special = false;
    
            // Fetch price filters
            const PriceFilters = await PriceFilter.find({});
    
            res.render('admin/edit-product', {
                admin,
                success,
                error,
                title: product.title,
                description: product.description,
                categories,
                category: product.category,
                image: product.image,
                special,
                vegan,
                price: product.price,
                id: product._id,
                gallery: product.images,
                PriceFilters,
                // Pass price filters to the view
            });
        } catch (error) {
            console.error(error);
            res.render('admin/404');
        }
    }
const postEditProduct = async (req, res) => {
    const { title, pimage, description, price, category, special, vegan, priceFilters } = req.body;
    console.log(special, '  ', vegan);
    const slug = title.toLowerCase();
    const image = typeof req.file !== "undefined" ? req.file.filename : "";
    const id = req.params.id;
    const price2 = parseFloat(price).toFixed(2);

    Product.findOne({ slug, category, _id: { $ne: id } }, (err, product) => {
        console.log('searching for pro');
        if (err) console.log(err);
        if (product) {
            console.log('same product found');
            fs.unlink('public/images/product-img/' + pimage, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');
            });
            req.flash('error', 'Product exists, choose another name.');
            return res.redirect('/admin/product/edit-product/' + id);
        } else {
            console.log('updating pro');

            Product.findById(id, async (err, product) => {
                if (err) console.log(err);
                let img = image !== "" ? image : pimage;

                product.title = title;
                product.slug = slug;
                product.description = description;
                product.price = price2;
                product.category = category;
                product.image = img;
                product.special = special;
                product.vegan = vegan;
                product.PriceFilters= priceFilters;

                await product.save((err) => {
                    if (err) return console.log(err);
                    console.log('saving pro');

                    if (image !== "") {
                        console.log('image is already there');

                        if (product.image !== "") {
                            console.log('image updated');

                            fs.unlink('public/images/product-img/' + pimage, (err) => {
                                if (err) console.log(err);
                                console.log('old img deleted');
                            });
                        }
                    }
                    req.flash('success', 'Product edited successfully.');
                    res.redirect('/admin/product');
                });
            }).catch((err) => {
                console.log(err);
                // res.render('admin/404')
            });
        }
    });
};

const postAddGallery = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const images = req.files;

    if (images.length > 0) {
        const imageName = images.map((img) => {
            return img.filename;
        });

        await imageName.map((img) => {
            Product.findByIdAndUpdate({ _id: id }, { $push: { images: img } })
                .then((pro) => {
                    pro.save(() => {
                        console.log('saved');
                    });
                });
        });

        req.flash('success', 'gallery added!');
        res.redirect('/admin/product/edit-product/' + id);
    } else {
        res.redirect('/admin/product');
    }
};

const getDeleteGallery = async (req, res) => {
    const id = req.params.id;
    const img = req.params.img;

    Product.findById(id, async (err, pro) => {
        if (err) {
            console.log(err);
            return res.redirect('/admin/*');
        }
        pro.images.pull(img);
        await pro.save(() => {
            fs.unlink('public/images/product-img/' + img, (err) => {
                if (err) console.log(err);
                console.log('old img deleted');
            });
            res.redirect('/admin/product/edit-product/' + id);
        });
    });
};

const getDeleteProduct = async (req, res) => {
    Product.findById(req.params.id, (err, pro) => {
        if (err) return console.log(err);
        fs.unlink('public/images/product-img/' + pro.image, (err) => {
            if (err) console.log(err);
            console.log('old img deleted');
        });
        pro.images.map((img) => {
            return fs.unlink('public/images/product-img/' + img, (err) => {
                if (err) console.log(err);
                console.log('old imgs deleted');
            });
        });

        Product.deleteOne(pro, () => {
            req.flash('success', 'Product deleted successfully!');
            res.redirect('/admin/product');
        });
    });
};




module.exports = {
    getProducts,
    getAddProduct,
    postAddProduct,
    getEditProduct,
    postEditProduct,
    postAddGallery,
    getDeleteGallery,
    getDeleteProduct,
};