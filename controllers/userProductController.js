// user-product-controller.js
const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Wishlist = require('../models/wishlistModel');
const PriceFilter=require('../models/priceFilterModel');
const pdf=require("pdf-creator-node")

const getAllProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        let categories = await Category.find({});
        let priceFilters = await PriceFilter.find({});
        let count = null;
        let list = null;

        const user = req.session.user;
        if (user) {
            req.session.user.discount = null;

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
            list = await Wishlist.findOne({ userId: req.session.user._id }).populate("wishlist.product");
        }

        let sortOption = {};

        // Check if the sort parameter is present in the query
        if (req.query.sort === 'low') {
            // Ascending order by price
            products = products.sort((a, b) => a.price - b.price);
        } else if (req.query.sort === 'high') {
            // Descending order by price
            products = products.sort((a, b) => b.price - a.price);
        }

        res.render('user/products', { products, categories, priceFilters, user, count, wishcount, list });
    } catch (error) {
        console.error(error);
        let categories = await Category.find({});
        let priceFilters = await PriceFilter.find({});
        res.render('user/404', { categories, priceFilters });
    }
};
const getProductsByCategory = async (req, res) => {
    try {
        const priceFilters=await PriceFilter.find();
        let category = req.params.category;
        let categories = await Category.find({});
        let products = await Product.find({category:category});
        let count =null
        const user = req.session.user;
        if(user){
            
            const cartItems = await Cart.findOne({userId:user._id});
        
            if(cartItems){
                count = cartItems.cart.length;
            }
        }
        let wishcount = null;
       
        // let t = await Cart.findOne({ userId: id }).populate("cart.product");
        if (user) {
    
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
    
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        console.log(products.length);
        res.render('user/products',{products,categories,priceFilters,user,count,wishcount});
        // res.json({status:true})
    } catch (err) {
        if(err) res.render('user/404')
    }
   
}

const getProductsByFilter = async (req, res) => {
    try {
        let filter = req.params.fil;
        let priceFilters = await PriceFilter.find({});
        let products = await Product.find({priceFilter:filter});
        let count =null
        const user = req.session.user;
        if(user){
            
            const cartItems = await Cart.findOne({userId:user._id});
        
            if(cartItems){
                count = cartItems.cart.length;
            }
        }
        let wishcount = null;
       
        // let t = await Cart.findOne({ userId: id }).populate("cart.product");
        if (user) {
    
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
    
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        console.log(products.length);
        res.render('user/products',{products,categories,priceFilters,user,count,wishcount});
        // res.json({status:true})
    } catch (err) {
        if(err) res.render('user/404')
    }
   
}

const getVeganProducts = async (req, res) => {
    let products = await Product.find({vegan:true});
    let count =null
    const user = req.session.user;
    if(user){
        
        const cartItems = await Cart.findOne({userId:user._id});
    
        if(cartItems){
            count = cartItems.cart.length;
        }
    }
    let wishcount = null;
   
    // let t = await Cart.findOne({ userId: id }).populate("cart.product");
    if (user) {

        const wishlistItems = await Wishlist.findOne({ userId: user._id });

        if (wishlistItems) {
            wishcount = wishlistItems.wishlist.length;
        }
    }
    console.log(products.length);
    res.render('user/products',{products,user,count,wishcount});
}

const getProductDetails = async (req, res) => {
    let id = req.params.id;
    try{

        let product = await Product.findById(id)
        let images = product.images;
        const user = req.session.user;
        let count =null
        if(user){
            
            const cartItems = await Cart.findOne({userId:user._id});
        
            if(cartItems){
                count = cartItems.cart.length;
            }
        }
        let wishcount = null;
       
        // let t = await Cart.findOne({ userId: id }).populate("cart.product");
        if (user) {
    
            const wishlistItems = await Wishlist.findOne({ userId: user._id });
    
            if (wishlistItems) {
                wishcount = wishlistItems.wishlist.length;
            }
        }
        res.render('user/single-product',{product,images,user,count,wishcount});
    }catch(err){
        if(err)
        res.render('user/404');
    }

};

module.exports = {
    getAllProducts,
    getProductsByCategory,
    getProductsByFilter,
    getVeganProducts,
    getProductDetails,
};
