var express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
//locall
const { authenticate } = require('../../middleware/authenticate');
const { user } = require('../../db/model/user');
//variable
let router = express.Router();

router.post('/add_to_cart', authenticate, (req, res) => {
  let token = req.header('x-auth');
  let decoded = jwt.verify(token, 'arshyan');
  const body = _.pick(req.body, [
    'product_id',
    'product_payment',
    'product_support_payment',
    'term1_id',
    'term1_payment',
    'term1_support_payment',
  ]);
  user
    .findOne({ _id: decoded._id })
    .then((user_res) => {
      if (!user_res) return Promise.reject();
      if (
        user_res.cart.filter((item) => item.product_id === body.product_id)
          .length
      ) {
        user_res.cart = user_res.cart.map((item) => {
          if (item.product_id === body.product_id) {
            return {
              product_id: body.product_id,
              support_all_payment: body.product_support_payment,
              product_payment: body.product_payment,
              term1_id: body.term1_id,
              term1_payment: body.term1_payment,
              term1_support_payment: body.term1_support_payment,
            };
          } else {
            return item;
          }
        });
        user_res
          .save()
          .then(() =>
            res.status(200).json({
              message: `updated!`,
            })
          )
          .catch((err) =>
            res.status(400).json({
              message: `not updated!`,
              err,
            })
          );
      } else {
        user_res.cart.push({
          product_id: body.product_id,
          support_all_payment: body.product_support_payment,
          product_payment: body.product_payment,
          term1_id: body.term1_id,
          term1_payment: body.term1_payment,
          term1_support_payment: body.term1_support_payment,
        });
        user_res
          .save()
          .then((data) =>
            res.status(200).json({
              message: `success`,
              data,
            })
          )
          .catch((err) =>
            res.status(400).json({
              message: `faild.`,
              err,
            })
          );
      }
    })
    .catch((err) =>
      res.status(400).json({
        message: `faild!`,
        err,
      })
    );
});

module.exports = router;
