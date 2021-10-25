const express = require('express');
//local
const { authenticate } = require('../../middleware/authenticate');
//variable
let router = express.Router();

router.get('/check_token', authenticate, (req, res) => {
  res.status(200).json({
    message: `Token is available.`,
  });
});

module.exports = router;
