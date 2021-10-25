var express = require('express');
//locall
const { product } = require('../../db/model/product');
//variable
let router = express.Router();

router.get('/home', (req, res) => {
  const home_data = {};
  product
    .find()
    .then((data) => {
      if (data.length === 0) return Promise.reject();
      home_data.frequency = data
        .filter((item) => item.type === 'frequency')
        .slice(-4)
        .reverse();
      home_data.products = data
        .filter((item) => item.type === 'products')
        .slice(-4)
        .reverse();
      home_data.courses = data
        .filter((item) => item.type === 'courses')
        .slice(-4)
        .reverse();
      home_data.videos = data
        .filter((item) => item.type === 'videos')
        .slice(-4)
        .reverse();
      home_data.free = data
        .filter((item) => item.price === '0')
        .slice(-4)
        .reverse();
      res.status(200).json({
        message: `success.`,
        home_data,
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
