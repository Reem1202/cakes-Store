$(document).on("turbolinks:load", function () {
  setTimeout(function () {
    $(".alert").fadeOut();
  }, 3000);
});

$("#add-edit").validate({
  errorClass: "error fail-alert",
  // validClass: "valid success-alert"

  rules: {
    title: {
      required: true,
      minlength: 5,
    },
    category: {
      required: true,
    },
    price: {
      required: true,
      min: 1, 
      number: true, 
    },
    description: {
      required: true,
    },
    image: {
      extension: "jpg|jpeg|png|ico|bmp",
    },
    banner: {
      required: true,
      extension: "jpg|jpeg|png|ico|bmp",
    },
  },
  messages: {
    title: {
      required: "Add a title",
      minlength: "Title should be at least 5 characters",
    },

    category: {
      required: "Select a category",
    },
    price: {
      required: "Add its price",
      min: "Price should be  greater than 1",
      number: "Please enter a valid number for the price",
    },
    description: {
      required: "Add description",
    },
    image: {
      extension:
        "Please upload file in these format only (jpg, jpeg, png, ico, bmp).",
    },
    banner: {
      required: "Select an image",
      extension:
        "Please upload file in these format only (jpg, jpeg, png, ico, bmp).",
    },
  },
});

$("#user-signup-form").validate({
  errorClass: "error fail-alert",

  rules: {
    name: {
      required: true,
      minlength: 4,
    },
    email: {
      required: true,
      email: true,
    },
    contact: {
      required: true,
      number: true,
    },
    password: {
      required: true,
      minlength: 6,
      strongPassword: true, 
      notEqualToExistingPassword:true,
    },
    cpassword: {
      required: true,
      minlength: 6,
      equalTo: "#password",
    },
  },
  messages: {
    name: {
      required: "Please enter your name.",
      minlength: "Name should be at least 4 characters.",
    },
    contact: {
      required: "Please enter your Mobile no.",
    },
    email: {
      required: "Please enter your email.",
      email: "The email should be in the format: abc@domain.tld",
    },
    password: {
      required: "Please enter your Password.",
      minlength: "Password should be at least 6 characters.",
      strongPassword: "Password should contain at least one special character.",
      notEqualToExistingPassword:"New password should be different from existing one",
    },
    cpassword: {
      required: "Re-enter your Password.",
      equalTo: "Password is not matching!",
    },
  },
 
});
$.validator.addMethod(
  "strongPassword",
  function (value, element) {
    // Use a regular expression to check for at least one special character
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
  },
  "Password should contain at least one special character.",
  
);
$.validator.addMethod(
  "notEqualToExistingPassword",
  function (value, element) {
    // You might need to adjust this condition based on how you fetch the existing password
    // For demonstration purpose, I'm assuming it's fetched in the 'existingPassword' variable
    return value !== existingPassword;
  },
  "New password should be different from the existing one."
);
$("#user-login-form").validate({
  errorClass: "error fail-alert",

  rules: {
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  },
  messages: {
    email: {
      required: "Please enter your email.",
      email: "The email should be in the format: abc@domain.tld",
    },
    password: {
      required: "Please enter your Password.",
    },
  },
});

$("#admin-login-form").validate({
  errorClass: "error fail-alert",

  rules: {
    email: {
      required: true,
      email: true,
    },
    password: {
      required: true,
    },
  },
  messages: {
    email: {
      required: "Please enter your email.",
      email: "The email should be in the format: abc@domain.tld",
    },
    password: {
      required: "Please enter your Password.",
    },
  },
});

$("#password").validate({
  errorClass: "error fail-alert",

  rules: {
    password: {
      required: true,
      minlength: 6,
    },
    npassword: {
      required: true,
      minlength: 6,
      strongPassword:true,
      notEqualTo:"#password",
    },
    cpassword: {
      required: true,
      minlength: 6,
      equalTo: "#npassword",
    },
  },
  messages: {
    password: {
      required: "Please enter your existing Password.",
      minlength: "Password should be at least 6 characters.",
      strongPassword: "Password should contain at least one special character.",
    },
    npassword: {
      required: "Please enter your new Password.",
      minlength: "Password should be at least 6 characters.",
      notEqualTo:"new password should be different from the  existing one."
    },
    cpassword: {
      required: "Re-enter your Password.",
      minlength:"password should be atleast 6 characters.",
      equalTo: "Password is not matching!",
    },
  },
});

$.validator.addMethod(
  "strongPassword",
  function (value, element) {
    // Use a regular expression to check for at least one special character
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
  },
  "Password should contain at least one special character."
);
$.validator.addMethod(
  "notEqualTo",
  function(value,element,param){
    return value !==$(param).val();
  },
  "Please enter a different value"
);
$("#otp-form").validate({
  errorClass: "error fail-alert",

  rules: {
    otp: {
      required: true,
      minlength: 6,
      maxlength: 6,
    },
  },
  messages: {
    otp: {
      required: "Please enter your OTP.",
      minlength: "OTP should be  6 numbers.",
      maxlength: "OTP should be  6 numbers.",
    },
  },
});
$("#email-form").validate({
  errorClass: "error fail-alert",

  rules: {
    email: {
      required: true,
      email: true,
    },
  },
  messages: {
    email: {
      required: "Please enter your email.",
      email: "Please enter valid email",
    },
  },
});

$("#add-address").validate({
  errorClass: "error fail-alert",
  rules: {
    name: {
      required: true,
      minlength: 4,
    },
    housename: {
      required: true,
      minlength: 4,
    },
    pin: {
      required: true,
      minlength: 6,
    },
    contact: {
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    district: {
      required: true,
    },
  },
  messages: {
    name: {
      required: "Enter a name",
      minlength: "Name should be at least 4 characters.",
    },
    housename: {
      required: "Enter housename",
      minlength: "Housename should be at least 4 characters.",
    },
    pin: {
      required: "Enter pincode",
      minlength: "Enter a valid pin",
    },
    contact: {
      required: "Enter contact number",
      minlength: "Contact should be 10 digits",
      maxlength: "Contact should be 10 digits",
    },
    district: {
      required: "Choose district",
    },
  },
});
//


let searchForm = document.querySelector(".header .search-form");

document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  navbar.classList.remove("active");
};

let navbar = document.querySelector(".header .navbar");

var container = $("#search-results");
document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
};
$(document).click(function () {
  var search = $(".header .search-form");

  if (!container.is(event.target) && !container.has(event.target).length) {
    container.hide();
  }
});

let slides = document.querySelectorAll(".home .slide");
let index = 0;

function next() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

function prev() {
  slides[index].classList.remove("active");
  index = (index - 1 + slides.length) % slides.length;
  slides[index].classList.add("active");
}

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#img-prvw").attr("src", e.target.result).width(100).height(100);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

$("#image").change(function () {
  readURL(this);
});

function editProfile() {
  $("#edit-profile").toggleClass("hide");
}
function addAddress() {
  $("#add-address").toggleClass("hide");
}
function editAddress(index) {
  $("#edit-address-" + index).toggleClass("hide");
}

if ($("[data-fancybox]").length) {
  $("[data-fancybox]").fancybox();
}

// Get the modal
var modal = document.getElementById("id01");

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function addToCart(proId, wt) {
  $.ajax({
    url: "/cart/add/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        console.log("succ");
        location.reload();
      } else {
        console.log("no user");
        location.href = "/login";
      }
    },
  });
}
function removeFromCart(proId, wt) {
  $.ajax({
    url: "/cart/delete/" + proId + "/" + wt,
    method: "get",
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}
function changeQuantity(proId, wt, price, count) {
  let qty = $("#qtyOf" + proId).text();

  $.ajax({
    url: "/cart/change-quantity",
    data: {
      proId: proId,
      wt: wt,
      price: price,
      count: count,
      qty: parseInt(qty),
    },
    method: "post",
    success: (response) => {
      // if(response.status){
      console.log(response);

      location.reload();
    },
  });
}

function getPrice(proId, proprice, cartprice, wt) {
  let qty = $("#qtyOf" + proId).text();

  $.ajax({
    url: "/cart/change-weight",
    data: {
      proId: proId,
      proprice: proprice,
      cartprice,
      cartprice,
      wt: wt,
      qty: qty,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}

function addToWishlist(proId) {
  $("#" + proId + "-heart").toggleClass("fa-like");

  $.ajax({
    url: "/wishlist/add/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        if (response.item == "added") {
          $("#" + proId + "-heart").css({ color: "red", background: "white" });
        } else {
          $("#" + proId + "-heart").css({ color: "white" });
        }
        location.reload();
      } else {
        location.href = "/login";
      }
    },
  });
}

function addToCartAndRemove(proId) {
  $.ajax({
    url: "/cart/add/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        removeFromWishlist(proId);
        location.reload();
      }
    },
  });
}
function removeFromWishlist(proId) {
  $.ajax({
    url: "/wishlist/delete/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        //  let count =  $("#cart-count").html();
        //  count = parseInt(count)-1 ;
        //   $('#cart-count').html(count);
        location.reload();
      }
    },
  });
}

function selectAddress(addressIndex) {
  $.ajax({
    url: "/cart/place-order/select-address",
    method: "post",
    data: {
      addressIndex: addressIndex,
    },
    success: (response) => {
      if (response.status) {
        location.reload();
        console.log(response);
      }
    },
  });
}

$("#payment-form").validate({
  errorClass: "error fail-alert",
  rules: {
    payment: {
      required: true,
    },
  },
  messges: {
    payment: {
      required: "Select payment method",
    },
  },
  errorPlacement: function (error, element) {
    if (element.is(":radio")) {
      error.insertBefore($(element).parents(".pay-form"));
    } else {
      // This is the default behavior
      error.insertAfter(element);
    }
  },
});

$("#payment-form").submit((e) => {
  e.preventDefault();
  $.ajax({
    url: "/cart/payment",
    method: "post",
    data: $("#payment-form").serialize(),
    success: (response) => {
      // alert(response)
      if (response.codStatus == "placed") {
        console.log(response);
        console.log(response.status);

        location.href = "/cart/place-order/success";
      } else {
        console.log(response + "response");
        razorpayPayment(response);
      }
    },
  });
});

function razorpayPayment(order) {
  var options = {
    key: "rzp_test_M7kqvBj4orNzLd", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "cakes.N.bakes",
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);
      console.log("verify fn");
      verifyPayment(response, order);
    },
    prefill: {
      name: "Gaurav Kumar",
      email: "gaurav.kumar@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#3399cc",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function verifyPayment(payment, order) {
  $.ajax({
    url: "/cart/verify-payment",
    data: {
      payment,
      order,
    },
    method: "post",
    success: (response) => {
      if (response.status) {
        location.href = "/cart/place-order/success";
      }
    },
  });
}

function cancelOrder(id) {
  $.ajax({
    url: "/orders/order-cancel/" + id,
    method: "get",
    success: (response) => {
      if (response.status) {
        location.reload();
      }
    },
  });
}

function changeStatus(id) {
  let status = $("#update-order-status").val();
  $.ajax({
    url: "/admin/orders/change-status/" + id,
    method: "post",
    data: {
      status,
    },
    success: (response) => {
      console.log("response got");
      if (response.status) {
        console.log("response true");
        location.reload();
      }
    },
  });
}
$(".alert-danger").fadeOut(5000);
$(".alert-success").fadeOut(5000);

function getProducts() {
  let category = $("#categoryFilter").val();
  let priceFilter= $("#priceFilter").val();
  let sort = $("#sort").val();
  console.log(sort + " sort");
  $.ajax({
    url: "/products" ,
    method: "get",
    data: {
      category:category,
      price:priceFilter,
      sort: sort,
    },
    success: (response) => {
      console.log("response got");
      // if (response.status) {
      //   console.log('response true');
      if (category == "All") {
        location.href = "/products";
      } else if (category == "vegan") {
        location.href = "products/vegan";
      } else {
        location.href = "/products/" + category;
      }
      // }
    },
  });
}

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("modal-close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};


//-------- search-bar

function sendData(e) {
  const searchResults = document.getElementById("search-results");
  let match = e.value.match(/^[a-zA-Z ]*/);
  let match2 = e.value.match(/\s*/);
  if (match2[0] === e.value) {
    searchResults.innerHTML = "";
    return;
  }
  if (match[0] === e.value) {
    $.ajax({
      url: "/search",
      method: "post",
      data: {
        payload: e.value,
      },
      success: (response) => {
        let payload = response.payload;
        searchResults.style.display = "block";
        searchResults.html = "";
        if (payload.length < 1) {
          searchResults.innerHTML = "No Product";
          return;
        }
        payload.forEach((element, index) => {
          if (index > 0) searchResults.innerHTML = "<hr>";
          searchResults.innerHTML += `<div><a href="/products/product-details/${element._id}"><p class='h3'>${element.title}</p> <img width='50px' src='/public/images/product-img/${element.image}'> </a></div> <br>`;
        });
      },
    });
    return;
  }
  searchResults.innerHTML = "";
}

function copyToClipboard(id) {
  let text = document.getElementById("copy-code-" + id);
  let copyText = document.getElementById(id).innerText;
  navigator.clipboard.writeText(copyText);
  text.innerText = "copied";
  // window.location.reload();
}

function change_image(image) {
  var container = document.getElementById("main-image");

  container.src = image.src;
}

document.addEventListener("DOMContentLoaded", function (event) {});
