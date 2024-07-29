# caKing
A feature-rich E-commerce website for cakes & bakes, made
with NodeJS in the backend, EJS in the frontend, and MongoDB as the
database.
### Features includes:
In user side,
- Registration & verification
- Product list
- Wishlist
- Cart
- Order placement
- Order history <br>

In admin side,

- Dashboard
- Category management
- Product management
- User management 
- Banner management
- Coupon management

### Tools and technologies used : 

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/bootstrap-%23563D7C.svg?style=for-the-badge&logo=bootstrap&logoColor=white)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

| Technology          | Description                                        |
|---------------------|----------------------------------------------------|
| Node JS, Express JS | For backend                                        |
| EJS                 | As view engine                                     |
| Mongoose            | Database library                                   |
| CSS and Bootstrap   | For styling                                        |
| Nodemailer          | For sending emails                                 |
| Axios               | For API calls                                      |
| Bcrypt              | For password hashing                               |
| Multer              | For multiple file upload                           |
| JQuery-validation   | Form validation                                    |
| Razorpay            | For payment integration                            |
| Otp-generator       | To generate random OTP                             |
| Chart JS            | To make diagramatic <br>reports on admin dashboard |

# Pages of my website:

## User side :
 
- ### **Homepage** <br>

   Home page is visible for every user entering into website. It contains banners linking into categories, special products, and all categories of      products. If the user is logged in, the name will show on the navbar.
   
   <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_%20(1).png" width="500"> <br>
 
   **Navbar difference for logged in user and other users**
 
   <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(218).png" height="100"> <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(219).png" height="100">

 
 - ### **Register** <br>
 
   User can register by filling the validated form, and then have to verify registered email by opening the link received in the email.<br>
 
   <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(220).png" width="500"> <br>

- ### **Login** <br>
  
   User have to enter verified email and password to enter into shop. In case of forgot password, there is an option to set new password by matching OTP received to verified email. <br>
 
   <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(221).png" width="500"> <br>
 
   **Forgot password** 
 
   <img width="200" alt="Capture" src=https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(222).png>

 - ### **Products** <br>
  
   It is the page that listing all products for user. User can click the button for view product, add to wishlist, or add to cart. <br>
 
   <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_products.png" width="500"> <br>

   **Hover view on single product**

    <img width="200" alt="prodct" src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(223).png">
  - ### **Product details** <br>
  
    The page shows the detailed description of product with price and buttons for add to wishlist and add to cart.
  
    <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(224).png" width="500"> <br>
 
  - ### **Wishlist** <br>
  
    User can add and remove products here to save for later and can directly move to cart for placement.

    <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(225).png" width="500"> <br>
     
  - ### **Cart** <br>
    <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_cart.png" width="500"> <br>
   
    User can add or remove products to cart for order placement and can change quantity of products. Discount coupons are also available 
   and can view by clicking the button 'Available coupons'.
 
  - ### **Place order** <br>
    <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(226).png" width="500"> <br>
   
    User can select or add address for delivery and choose payment method and then place the order. After successful order placement, the window will show the below screen.
    
    **Order success page**
   
     <img width="200" alt="ordr succs" src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(227).png"> <br>
   
  - ## **Order history** <br>
    <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_orders.png" width="500"> <br>
   
    User can see previous orders list and on clicking a particular order, the details of that order has shown like the image below. The cancellation of orders is available only for 2 hours from the time of order placement.
   
    <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(228).png" width="500"> <br>
   
   - ### **Contact** <br>
   
     This is an active contact form to connect with company. User can send message through this form. There is also a location of the company.

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_contact.png" width="500"> <br>
    
 ## Admin side :
 
  - ### **Login** <br>
  
     Admin can login by typing predefined email and password and enter to dashboard.

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(229).png" width="500"> <br>
      
  - ###  **Dashboard** <br>
  
     Dashboard includes counts of reports and diagramatic representaion of reports

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_admin_dashboard(Asus%20Zenbook%20Fold).png" width="500"> <br>
     
  - ### **User management** <br>
  
     Admin can view user lists and block or unblock users

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(230).png" width="500"> <br>

  - ### **Category management** <br>
  
     Admin can view all categories, add new category, edit current categories, and remove unwanted categories only if product on that category is empty.

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(231).png" width="500"> <br>

  - ### **Product management** <br>
    
     Admin can view all products, add new items into categories, remove products and edit product details. There is an option in edit form to add multiple images of products and also there is a checkbox to make product vegan or special to display in those categories. <br>
   
     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(232).png" width="500"> <br>

    **Edit form for product**
 
     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/localhost_4000_admin_product_edit-product_6583cbe252ac9ab4e25d6d0a.png" width="500"> <br>

 - ### **Order management** <br>
 
     Admin can view all orders and update order status from this page.

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(233).png" width="500"> <br>

  - ### **Coupon management** <br>
  
     Admin can create discount coupons, remove old coupons or edit coupons from this page

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(234).png" width="500"> <br>

- ### **Banner management** <br>

     Admin can add banners to display in homepage with title, description and link to category.

     <img src="https://github.com/Reem1202/cakes-Store/blob/main/screenshots/Screenshot%20(235).png" width="500"> <br>












"# reem-cake" 
