const axios = require('axios');
var express = require('express');
const _ = require('lodash');
//locall
const { product } = require('../../db/model/product');
//variable
let router = express.Router();

router.post('/get_product_by_type', (req, res) => {
  const body = _.pick(req.body, ['type']);

  product
    .find({ type: body.type })
    .then((data) => {
      if (data.length === 0) return Promise.reject();
      res.status(200).json({
        message: `products found.`,
        data,
      });
    })
    .catch((err) =>
      res.status(400).json({
        message: `product not found.`,
        err,
      })
    );
});

module.exports = router;
