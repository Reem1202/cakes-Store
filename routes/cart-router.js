const express = require("express");
const cartRouter = express.Router();
const fs=require("fs");
const path=require("path")
// const Category = require('../models/categoryModel');
const Product = require("../models/productModel");
const Wishlist = require("../models/wishlistModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const auth = require("../config/auth");
const Address = require("../models/addressModel");
const Order = require("../models/orderModel");
const pdf=require("pdf-creator-node");
const Handlebars=require("handlebars")



Handlebars.create({
  allowedProtoProperties: {
    _id: true,
    date: true,
    address: true,
    orderDetails: true,
    total: true,
    shipping: true,
    discount: true,
    amountPaid: true
  },
  allowProtoMethodsByDefault: true,
  allowProtoPropertiesByDefault: true
});
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: "rzp_test_M7kqvBj4orNzLd",
  key_secret: "tbZOzwOin4RoIHaszi12ZhN3",
});

cartRouter.get("/", auth.isUser, async (req, res) => {
  let user = req.session.user;
  let id = user._id;
  let carts = await Cart.findOne({ userId: id }).populate("cart.product");
  let coupons = await Coupon.find({});
  let count = null;
  let sum = null;
  let discount = req.session.user.discount;
  if (carts) {
    let cart = carts.cart;
    sum = cart.reduce((sum, x) => {
      return sum + x.sub_total;
    }, 0);
    req.session.user.total = sum;
    console.log(sum);
  }
  let shipping;
  if (sum > 2500) {
    shipping = 0;
  } else {
    shipping = 100;
  }
  // let t = await Cart.findOne({ userId: id }).populate("cart.product");
  if (user) {
    const cartItems = await Cart.findOne({ userId: user._id });

    if (cartItems) {
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
  const error = req.flash("error");
  res.render("user/cart", {
    carts,
    user,
    error,
    count,
    sum,
    shipping,
    wishcount,
    discount,
    coupons,
  });
});

cartRouter.post("/discount-coupon", async (req, res) => {
  let coupon = req.body.coupon;
  console.log(coupon);
  let total = req.session.user.total;
  Coupon.findOne({ coupon: coupon }, (err, c) => {
    if (err) console.log(err);
    if (c) {
      let offer = c.offer;
      // let expireDays = c.expiry
      // let couponDate = new Date(c.date)
      // couponDate.setDate(couponDate.getDate()+expireDays);
      // console.log(couponDate);
      let date = new Date();
      let exDate = new Date(c.expiry);
      // date = date.toDateString();
      date = date.getTime();
      exDate = exDate.getTime();
      console.log(date + " now", exDate + "   exp");
      console.log(c.coupon + " name");
      if (total >= c.minimum) {
        if (date > exDate) {
          console.log("expired");
          req.session.cartError="coupon expired!"
          res.json({ status: false ,message:"coupon expired"});
        } else {
          if (coupon.includes("%")) {
            req.session.user.discount = parseFloat(
              (req.session.user.total * offer) / 100
            ).toFixed(0);
          } else {
            req.session.user.discount = offer;
          }

          res.json({ status: true });
        }
      } else {
         req.session.cartError=`Your total amount is less than ${c.minimum}`;
        res.json({ status: false, message:`Your total amount is less than ${c.minimum}`});
      }
    } else {
     req.session.cartError="Invalid coupon!";
      res.json({ status: false, message: "Invalid coupon!"});
    }
  });
});
cartRouter.get("/remove-coupon", async (req, res) => {
  try {
    
    delete req.session.user.discount;

    // Respond with success status
    res.json({ status: true });
  } catch (error) {
    console.error("Error removing coupon:", error);
    res.status(500).json({ error: "An error occurred while removing coupon" });
  }
});

cartRouter.get("/add/:product", async (req, res) => {
  if (req.session.user) {
    let productid = req.params.product;
    console.log(productid);
    let user = req.session.user;
    let product = await Product.findById(productid);
    let price = product.price;
    let id = user._id;
    // console.log(id + user.name);
    let userCart = await Cart.findOne({ userId: id });

    // console.log(userCart + " userCart");

    if (!userCart) {
      // console.log(' cart is null');

      let newcart = new Cart({
        userId: id,
        cart: [
          {
            product: productid,
            quantity: 1,
            price: price,
            sub_total: price,
          },
        ],
      });
      await newcart.save();
      // console.log("cart created");
      // console.log(newcart);
    } else {
      // let cart = userCart.cart;

      // console.log('cart is not null');

      // let newItem = true;
      // let pro = await Cart.findOneAndUpdate({userId : id, 'cart.product':productid},{$inc:{'cart.quantity': 1}});

      // console.log(pro +" weight 1");
      // for (let i = 0; i < cart.length; i++) {

      //     if (cart[i].product == productid) {

      //         // let pro = await Cart.findOne({userId : id, 'cart[i].product':productid, "cart[i].weight":1}).projection({'cart[i].weight':1});
      //         // await Cart.findOneAndUpdate({ userId: id, "cart[i].product": productid ,'cart[i].weight':1},
      //         //     { $inc: { "cart[i].$.quantity": 1 } }).then(() => {
      //         //         console.log('updated');
      //         //     })
      //         newItem = false;

      //         console.log("old item qty increased");
      //         break;

      //     }
      // }
      // if (newItem) {
      //     console.log("new item");

      await Cart.findOneAndUpdate(
        { userId: id },
        {
          $push: {
            cart: {
              product: productid,
              quantity: 1,
              price: price,
              sub_total: price,
            },
          },
        }
      );

      console.log("new item pushed");

      // }
    }
    // console.log(userCart);

    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
});

cartRouter.get("/delete/:product/:weight", auth.isUser, async (req, res) => {
  const user = req.session.user;
  const { product, weight } = req.params;
  await Cart.findOneAndUpdate(
    { userId: user._id, "cart.weight": weight },
    { $pull: { cart: { product: product } } }
  );
  res.json({ status: true });
});
cartRouter.post("/change-quantity", auth.isUser, async (req, res) => {
  let user = req.session.user;
  let id = user._id;
  let { proId, wt, price, count, qty } = req.body;
  console.log(proId + " proid");
  // let cart = await Cart.findOne({userId:user._id});
  console.log(req.body);
  // let carts = await Cart.findOne({ userId: id }).populate("cart.product");
  // if(wt=0.5){
  if (count > 0) {
    Cart.updateOne(
      { userId: id, "cart.product": proId, "cart.weight": wt },
      { $inc: { "cart.$.quantity": count, "cart.$.sub_total": price } }
    ).then((res) => {
      console.log(res + "updated qty nf total" + proId);
    });
  } else {
    Cart.updateOne(
      { userId: id, "cart.product": proId, "cart.weight": wt },
      { $inc: { "cart.$.quantity": count, "cart.$.sub_total": -price } }
    ).then(() => {
      console.log("updated qty nf total");
    });
  }

  // }else if(wt==2){
  //     Cart.updateOne({ userId: id,"cart.product": proId},{$inc:{"cart.$.quantity":count,"cart.$.sub_total":  price}})

  // }else{
  //  Cart.updateOne({ userId: id,"cart.product": proId},{$inc:{"cart.$.quantity":count,"cart.$.sub_total":  parseInt(price)}})
  //  .then((data)=>{

  //      console.log(data + "res");
  //  });
  // }
  res.json({ status: true });
});

cartRouter.post("/change-weight", auth.isUser, async (req, res) => {
  let id = req.session.user._id;
  let { proId, proprice, cartprice, wt, qty } = req.body;
  console.log(proId, proprice, cartprice, wt, qty);
  proprice = parseInt(proprice);

  if (wt == 0.5) {
    await Cart.updateOne(
      { userId: id, "cart.product": proId },
      {
        $set: {
          "cart.$.weight": wt,
          "cart.$.price": parseFloat(
            proprice * wt + (proprice * 10) / 100
          ).toFixed(0),
          "cart.$.sub_total":
            qty * parseFloat(proprice * wt + (proprice * 10) / 100).toFixed(0),
        },
      }
    );
  } else if (wt == 2) {
    await Cart.updateOne(
      { userId: id, "cart.product": proId },
      {
        $set: {
          "cart.$.weight": wt,
          "cart.$.price": parseFloat(
            proprice * wt - (proprice * 10) / 100
          ).toFixed(0),
          "cart.$.sub_total":
            qty * parseFloat(proprice * wt - (proprice * 10) / 100).toFixed(0),
        },
      }
    );
  } else {
    await Cart.updateOne(
      { userId: id, "cart.product": proId },
      {
        $set: {
          "cart.$.weight": wt,
          "cart.$.price": proprice,
          "cart.$.sub_total": qty * proprice,
        },
      }
    );
  }
  console.log("updated weight");
  res.json({ status: true });
});

cartRouter.get("/place-order", auth.isUser, async (req, res) => {
  let user = req.session.user;
  let address = await Address.findOne({ userId: user._id });
  console.log(address + " address");
  let total = req.session.user.total;
  let discount = req.session.user.discount;
  let shipping;
  if (total > 2500) {
    shipping = 0;
  } else {
    shipping = 100;
  }
  

  // total= total+shipping-discount;
  console.log(total);
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
  res.render("user/place-order", {
    user,
    count,
    wishcount,
    address,
    total,
    shipping,
    discount,
  });
});

cartRouter.post(
  "/place-order/select-address",
  auth.isUser,
  async (req, res) => {
    let addressIndex = req.body.addressIndex;
    let user = req.session.user;
    // console.log(addressIndex );
    let address = await Address.findOne({ userId: user._id });
    let change = address.details.map((item) => {
      item.select = false;
      return item;
    });
    await Address.findOneAndUpdate(
      { userId: user._id },
      { $pull: { details: {} } }
    ).then((res) => {
      console.log(res);
    });
    await Address.findOneAndUpdate(
      { userId: user._id },
      { $push: { details: change } }
    ).then((res) => {
      console.log(res);
    });
    // console.log(change);
    Address.findOne({ userId: user._id }).then((res) => {
      let item = res.details[addressIndex];
      item.select = true;
      res.save();
    });

    // console.log(selectAddress + "slelehjjhf");
    // address = address.details;
    // address = address[addressIndex] ;
    res.json({ status: true });
  }
);

cartRouter.post("/payment", auth.isUser, async (req, res) => {
  try {
      let user = req.session.user;
      let paymentMethod = req.body.payment;
      let total = req.session.user.total;
     
      let carts = await Cart.findOne({ userId: user._id }).populate("cart.product");
      let address = await Address.findOne({ userId: user._id });
  
      let selectAddress = address.details.filter((item) => {
        return item.select == true;
      });
      let cart = carts.cart;
  
      let shipping;
      if (total > 2500) {
        shipping = 0;
      } else {
        shipping = 100;
      }
      let discount = req.session.user.discount ? req.session.user.discount : 0;
      let status = paymentMethod == "COD" ? "placed" : "pending";
      
      let amountPaid = total + shipping-discount; // Calculate total amount paid
      console.log("Total:", total);
console.log("Shipping:", shipping);
console.log("Discount:", discount);
console.log("Amount Paid (before saving):", amountPaid);

  
      let order = new Order({
        userId: user._id,
        address: selectAddress[0],
        orderDetails: cart,
        total: total,
        shipping: shipping,
        discount: discount,
        amountPaid: amountPaid, // Set the total amount paid
        date: new Date(),
        status: status,
        deliveryDate: new Date(+new Date() + 1 * 24 * 60 * 60 * 1000),
        paymentMethod: paymentMethod
      });
      await order.save();
  
      // Check if payment is online and update wallet if necessary
      if (status === "placed" && paymentMethod !== "COD") {
        const wallet = await Wallet.findOneAndUpdate(
            { userId: user._id },
            { $inc: { amount: -total } }, // Deduct the total amount paid
            { new: true }
        );
        console.log("Wallet balance updated:", wallet);
      }
  
      // Clear the user's cart after successful order
      await Cart.findByIdAndUpdate(
        { _id: carts._id },
        { $pull: { cart: {} } }
      );
  
      
      let netAmount = total + shipping-discount;
  
      // If payment is successful and order is placed, respond accordingly
      if (status == "placed") {
        res.json({ codStatus: status });
      } else if (status == "pending") {
        // If payment is pending, proceed with online payment using Razorpay or any other payment gateway
        let orders = await Order.findById(order._id);
  
        let options = {
          amount: parseInt(netAmount) * 100, // amount in the smallest currency unit (in your case, it's paisa)
          currency: "INR",
          receipt: "" + orders._id,
        };
  
        instance.orders.create(options, function (err, order) {
          if (err) console.log(err);
          console.log(order + " new order");
          console.log(order.receipt + " new order");
          res.json(order);
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "An error occurred while processing payment" });
    }
});
cartRouter.post("/verify-payment", async (req, res) => {
  console.log("payment vrfctn");
  let data = req.body;
  const crypto = require("crypto");
  let hmac = crypto.createHmac("sha256", "tbZOzwOin4RoIHaszi12ZhN3");

  hmac.update(
    data["payment[razorpay_order_id]"] +
      "|" +
      data["payment[razorpay_payment_id]"]
  );
  hmac = hmac.digest("hex");
  if (hmac == data["payment[razorpay_signature]"]) {
    await Order.findById(data["order[receipt]"]).then((res) => {
      console.log(res);
      res.status = "placed";
      res.save();
    });
    // await Order.findByIdAndUpdate({_id: data['order[receipt]']},{$set : {'orders.$.status': 'placed'}});
    console.log("updated");
    res.json({ status: true });
  } else {
    res.json({ status: "Payment failed" });
  }
});

cartRouter.get("/place-order/success", auth.isUser, async (req, res) => {
  try {
    let user = req.session.user;
    // Fetch the order data for the current user
    let order = await Order.findOne({ userId: user._id }).populate({
      
        path: "orderDetails.product",
       
          model: "Product",
        });

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
    let total = req.session.user.total;
    let shipping;
    if (total > 2500) {
      shipping = 0;
    } else {
      shipping = 100;
    }
    let discount = req.session.user.discount;

    let amountPaid=total+shipping-discount

    // Pass the order, total, shipping, and discount to the view
    res.render("user/order-success", {
      user,
      order, 
      count,
      wishcount,
      total,
      shipping,
      discount,
    });
  } catch (error) {
    console.error("Error fetching order data:", error);
    res.status(500).send("An error occurred while fetching order data");
  }
});
// Route to generate and download the invoice PDF
Handlebars.registerHelper('toFixed', function(num, digits) {
  return num.toFixed(digits);
});

const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    h1, h2 { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Invoice</h1>
  <p>Order ID: {{_id}}</p>
  <p>Date: {{date}}</p>
  <h2>Shipping Address</h2>
  <p>{{address.name}}</p>
  <p>{{address.street}}, {{address.district}}, {{address.state}} - {{address.pin}}</p>
  <h2>Order Details</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {{#each orderDetails}}
      <tr>
        <td>{{this.product.title}}</td>
        <td>{{this.quantity}}</td>
        <td>{{this.price}}</td>
        <td>{{this.sub_total}}</td>
      </tr>
      {{/each}}
    </tbody>
  </table>
  <h2>Summary</h2>
  <p>Total: {{total}}</p>
  <p>Shipping: {{shipping}}</p>
  <p>Discount: {{discount}}</p>
  <p>Amount Paid: {{amountPaid}}</p>
</body>
</html>
`;

cartRouter.get("/invoice/:orderId", auth.isUser, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate({
      path:"orderDetails.product",
      model:"Product"
    })

    if (!order) {
      return res.status(404).send("Order not found");
    }
    console.log(order)

    const document = {
      html: htmlTemplate,
      data: {
        ...order.toObject(),
        
        orderId: order._id
      },
      path: path.join(__dirname, `../invoices/invoice_${orderId}.pdf`),
      type: "",
    };

    pdf.create(document)
      .then((result) => {
        res.download(result.filename, `invoice_${orderId}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        res.status(500).send("Error generating invoice");
      });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send("An error occurred while fetching order data");
  }
});

module.exports = cartRouter;
