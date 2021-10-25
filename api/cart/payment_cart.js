var express = require('express');
const jwt = require('jsonwebtoken');
//local
const { authenticate } = require('../../middleware/authenticate');
const { user } = require('../../db/model/user');
const { product } = require('../../db/model/product');
const zarinpalLib = require('../../utils/zarinpal/zarinpal');
//var
let router = express.Router();

router.post('/payment_cart', authenticate, (req, res) => {
  let token = req.header('x-auth');
  let decoded = jwt.verify(token, 'arshyan');
  user.findOne({ _id: decoded._id }).then((user_res) => {
    const carts = user_res.cart.map((i) => i.product_id);
    product
      .find({
        _id: {
          $in: carts,
        },
      })
      .then((products_by_cartIds_res) => {
        if (products_by_cartIds_res.length > 0) {
          let final_cart = products_by_cartIds_res.map((item_p) => {
            const item_c = user_res.cart.find(
              (item_c) => item_c.product_id == item_p._id
            );
            console.log(item_c);
            const support_type = item_c.support_all_payment
              ? 'all'
              : item_c.term1_support_payment
              ? 'term1'
              : null;
            const support_price = item_c.support_all_payment
              ? item_p.support_price
              : item_c.term1_support_payment
              ? item_p.terms[0].support_price
              : null;
            const product_price = item_c.product_payment
              ? item_p.price
              : item_c.term1_payment
              ? item_p.terms[0].price
              : null;
            const product_type = item_c.product_payment
              ? 'all'
              : item_c.term1_payment
              ? 'term1'
              : null;
            let cart = {
              cart_info: {
                support_type,
                support_price,
                product_price,
                product_type,
                final_price: support_price + product_price,
              },
              product_id: item_p._id,
              term1_id: item_p.terms[0]._id,
            };
            return cart;
          });

          const prices = final_cart.map((i) => i.cart_info.final_price);
          const reducer = (accumulator, currentValue) =>
            accumulator + currentValue;
          let totalPrice = prices.reduce(reducer);
          console.log(totalPrice);

          zarinpalLib.request(
            totalPrice,
            user_res.email,
            user_res.phone_number,
            'payment cart',
            user_res._id,
            function (data) {
              if (data.status) {
                user_res.payments.push({
                  products: final_cart,
                  authority: data.authority,
                  price: totalPrice,
                  status: false,
                });
                user_res
                  .save()
                  .then((user_save) => {
                    if (!user_save) return Promise.reject();
                    res.status(200).json({
                      message: `sucsessfull`,
                      data,
                    });
                  })
                  .catch((err) => {
                    res.status(400).json({
                      message: `sucsessfull, user not update.`,
                      err,
                    });
                  });
              } else {
                res.status(400).json({
                  message: `unsucsessfull`,
                  err: appConfig.appTitle,
                });
              }
            }
          );
        }
      })
      .catch((err) =>
        res.status(400).json({
          message: `product not found.`,
          err,
        })
      );
  });
});

module.exports = router;
