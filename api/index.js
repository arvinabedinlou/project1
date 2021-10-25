var express = require('express');
var router = express.Router();

//local

//product
let get_single_product = require('./product/get_single_product');
let get_product_by_type = require('./product/get_product_by_type');
//users
let send_code = require('./users/send_code');
let verify_phone = require('./users/verify_phone');
let complete_information = require('./users/complete_information');
let get_profile = require('./users/get_profile');
let check_token = require('./users/check_token');
//comment
let add_comment = require('./comment/add_comment');
//home
let home = require('./home/home');
//cart
let add_to_cart = require('./cart/add_to_cart');
let payment_cart = require('./cart/payment_cart');
let verify_cart = require('./cart/verify_cart');

//product
router.use('', get_single_product);
router.use('', get_product_by_type);
//users
router.use('', send_code);
router.use('', verify_phone);
router.use('', complete_information);
router.use('', get_profile);
router.use('', check_token);
//comment
router.use('', add_comment);
//home
router.use('', home);
//cart
router.use('', add_to_cart);
router.use('', payment_cart);
router.use('', verify_cart);

module.exports = router;
