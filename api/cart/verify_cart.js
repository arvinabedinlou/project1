var express = require('express');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../../middleware/authenticate');
const { user } = require('../../db/model/user');
const { product } = require('../../db/model/product');
const zarinpalLib = require('../../utils/zarinpal/zarinpal');

let router = express.Router();

router.get('/verify_cart', (req, res) => {
  let success = false;
  let ref_id = '';
  user
    .findOne({ payments: { $elemMatch: { authority: req.query.Authority } } })
    .then((user_res) => {
      const payment_data = user_res.payments.filter(
        (payments) => payments.authority === req.query.Authority
      )[0];
      zarinpalLib.verify(
        payment_data.price,
        req.query.Authority,
        function (data) {
          if (data.status) {
            let new_products = payment_data.products.map((item) => ({
              product_id: item.product_id,
              payment: item.cart_info.product_type === 'all',
              support_all_payment: item.cart_info.support_type === 'all',
              term_ids:
                item.cart_info.product_type === 'term1'
                  ? [
                      {
                        term_id: item.term1_id,
                        payment: true,
                        support_payment:
                          item.cart_info.support_type === 'term1',
                      },
                    ]
                  : null,
            }));

            user_res.products = new_products;
            user_res.cart = [];
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].message = data.data.data.message;
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].card_hash = data.data.data.card_hash;
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].card_pan = data.data.data.card_pan;
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].ref_id = data.data.data.ref_id;
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].fee_type = data.data.data.fee_type;
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].fee = data.data.data.fee;
            user_res.payments.filter(
              (payments) => payments.authority === req.query.Authority
            )[0].status = true;
            user_res
              .save()
              .then(() => {
                success = true;
                ref_id = data.data.data.ref_id;
                res.render('verify_cart', { success, ref_id });
              })
              .catch(() => {
                success = false;
                res.render('verify_cart', { success, ref_id });
              });
          } else {
            success = false;
            res.render('verify_cart', { success, ref_id });
          }
        }
      );
    });
});

module.exports = router;
