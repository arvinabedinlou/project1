var express = require('express');
//locall
const zarinpalLib = require('../../utils/zarinpal/zarinpal');
//variable
let router = express.Router();

router.get('/payment', (req, res) => {
  //   console.log(req.query);
  zarinpalLib.request(
    10000,
    'm.faghani13@gmail.com',
    '09037551929',
    'test',
    '12345678',
    function (data) {
      if (data.status) {
        res.writeHeader(302, { Location: data.url });
        res.end();
      } else {
        res.render('error', {
          zpTitle: appConfig.appTitle,
          zpError: data.code,
        });
      }
    }
  );
});

module.exports = router;
