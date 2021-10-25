var express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
//locall
const { comment } = require('../../db/model/comment');
const { authenticate } = require('../../middleware/authenticate');
//variable
let router = express.Router();

router.post('/add_comment', authenticate, (req, res) => {
  let token = req.header('x-auth');
  let decoded = jwt.verify(token, 'arshyan');
  const body = _.pick(req.body, ['product_id', 'text', 'rate']);

  const new_comment = new comment({
    product_id: body.product_id,
    user_info: decoded._id,
    text: body.text,
    rate: body.rate,
    creation_date: new Date(),
  });

  new_comment
    .save()
    .then((data) =>
      res.status(200).json({
        message: `comment added.`,
        data,
      })
    )
    .catch((err) =>
      res.status(400).json({
        message: `comment not added.`,
        err,
      })
    );
});

module.exports = router;
