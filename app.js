//Import dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const nocache = require('nocache');
const dotenv = require('dotenv').config();
const pdf = require('pdf-creator-node'); 

// Import routers
const userRouter = require('./routes/user-router');
const adminRouter = require('./routes/admin-router');
const categoryRouter = require('./routes/category-router');
const priceFilterRouter = require('./routes/priceFilter-router');
const couponRouter = require('./routes/coupon-router');
const productRouter = require('./routes/product-router');
const profileRouter = require('./routes/profile-router');
const userProductRouter = require('./routes/user-product-router');
const cartRouter = require('./routes/cart-router');
const wishlistRouter = require('./routes/wishlist-router');
const orderRouter = require('./routes/order-router');
const walletRouter = require('./routes/wallet-router');
const orderStatusRouter = require('./routes/order-status-router');

// Import models
const Wishlist = require('./models/wishlistModel');
const Cart = require('./models/cartModel');

// Import configuration
const config = require('./config/database');

// Initialize app
const app = express();

// Connect to the database
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Database Connected'))
  .catch(err => console.error(`Database connection failed: ${err}`));

// Set view engine
app.set('view engine', 'ejs');

// Middleware
app.use(nocache());
app.use(cookieParser('cookieSecret'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000, secure: false },
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Define routes
app.use('/', userRouter);
app.use('/admin', adminRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/price-filters', priceFilterRouter);
app.use('/admin/product', productRouter);
app.use('/admin/orders', orderStatusRouter);
app.use('/admin/coupon', couponRouter);
app.use('/profile', profileRouter);
app.use('/products', userProductRouter);
app.use('/cart', cartRouter);
app.use('/wishlist', wishlistRouter);
app.use('/wallet', walletRouter);
app.use('/orders', orderRouter);

// Handle 404 for admin routes
app.get('/admin/*', (req, res) => {
  const admin = req.session.admin;
  res.status(404).render('admin/404', { admin });
});

// Handle 404 for user routes
app.get('*', async (req, res) => {
  const user = req.session.user;
  let count = null;
  let wishcount = null;

  if (user) {
    try {
      const cartItems = await Cart.findOne({ userId: user._id });
      count = cartItems ? cartItems.cart.length : 0;
      const wishlistItems = await Wishlist.findOne({ userId: user._id });
      wishcount = wishlistItems ? wishlistItems.wishlist.length : 0;
    } catch (error) {
      console.error(Error `fetching cart or wishlist items: ${error}`);
    }
  }

  res.status(404).render('user/404', { user, count, wishcount });
});

// Centralized error handling middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));