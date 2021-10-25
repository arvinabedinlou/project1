var express = require('express');
//locall
const { product } = require('../../db/model/product');
//variable
let router = express.Router();

router.get('/get_products', (req, res) => {
  product
    .find()
    .then((data) => {
      if (data.length === 0) return Promise.reject();
      res.status(200).json({
        message: `products found.`,
        products: data,
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
