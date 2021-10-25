var express = require('express');
const jwt = require('jsonwebtoken');
//locall
const { authenticate } = require('../../middleware/authenticate');
const { user } = require('../../db/model/user');
const { product } = require('../../db/model/product');
const { product_without_terms } = require('../../utils/products_without_terms');
//variable
let router = express.Router();

router.get('/get_profile', authenticate, (req, res) => {
  let token = req.header('x-auth');
  let decoded = jwt.verify(token, 'arshyan');

  user
    .findOne({ _id: decoded._id })
    .then((data) => {
      let finalData = data.toObject();
      if (!data) return Promise.reject();
      const carts = data.cart.map((i) => i.product_id);
      let products = data.products.map((i) => i.product_id);
      const promise1 = product
        .find({
          _id: {
            $in: products,
          },
        })
        .then((products_res) => {
          if (products_res.length > 0) {
            const arrOfIDs = finalData.products
              .filter(({ term_ids }) => term_ids)
              .map(({ term_ids }) => term_ids.flat())
              .flat()
              .map(({ term_id }) => term_id);
            console.log(arrOfIDs);
            let products_res_final = finalData.products.map((item) => {
              if (item.payment) {
                return products_res.find((i) => i._id == item.product_id);
              } else {
                let new_product = products_res.find(
                  (i) => i._id == item.product_id
                );
                new_product.terms = products_res
                  .find((i) => i._id == item.product_id)
                  .terms.filter(({ _id }) => arrOfIDs.includes(_id.toString()));
                return new_product;
              }
            });

            // let products_res_final = products_res.map(
            //   (products_res_final_map) => {
            //     let product_with_new_data = data.products.filter(
            //       (products_filter) =>
            //         products_filter._id === products_res_final_map._id
            //     )[0];
            //   }
            // );
            // console.log(products_res_final);

            finalData.products = products_res_final;
          }
        });
      const promise2 = product
        .find({
          _id: {
            $in: carts,
          },
        })
        .then((products_by_cartIds_res) => {
          if (products_by_cartIds_res.length > 0) {
            let final_cart = products_by_cartIds_res.map((item_p) => {
              const item_c = data.cart.find(
                (item_c) => item_c.product_id == item_p._id
              );
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
                product_info: product_without_terms(item_p),
              };
              return cart;
            });

            const prices = final_cart.map((i) => i.cart_info.final_price);
            const reducer = (accumulator, currentValue) =>
              accumulator + currentValue;
            let totalPrice = prices.reduce(reducer);
            finalData.cart_total = totalPrice;

            finalData.cart = final_cart;
          }
        });

      Promise.all([promise1, promise2]).then((values) => {
        res.status(200).json({
          message: `user found.`,
          data: finalData,
        });
      });
    })
    .catch((err) =>
      res.status(400).json({
        message: `user not found.`,
        err,
      })
    );
});

module.exports = router;

module.exports