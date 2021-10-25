const axios = require('axios');
var express = require('express');
const _ = require('lodash');
//locall
const { product } = require('../../db/model/product');
const { comment } = require('../../db/model/comment');
const { user } = require('../../db/model/user');
const { product_without_terms } = require('../../utils/products_without_terms');
//variable
let router = express.Router();

router.post('/get_single_product', (req, res) => {
  const body = _.pick(req.body, ['product_id']);

  product
    .findOne({ _id: body.product_id })
    .then((product_res) => {
      if (!product_res) return Promise.reject();
      let product_res_final = product_res.toObject();
      product_res_final.term1_price = product_res_final.terms[0].price;
      comment
        .find({ product_id: product_res_final._id })
        .populate('user_info')
        .then((comment_res) => {
          res.status(200).json({
            message: `products found.`,
            product_data: {
              product_info: product_without_terms(product_res_final),
              comment_info: comment_res,
            },
          });
        })
        .catch((err) => {
          res.status(200).json({
            message: `products found.`,
            product_data: {
              product_info: product_without_terms(product_res_final),
              comment_info: comment_res,
            },
          });
        });
    })
    .catch((err) => {
      res.status(400).json({
        message: `product not found.`,
        err,
      });
    });
});

module.exports = router;
