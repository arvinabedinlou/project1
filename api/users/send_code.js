var express = require('express');
const axios = require('axios');
const _ = require('lodash');
//local
const { verify_code } = require('../../db/model/verify_code');
//variable
let router = express.Router();

router.post('/send_code', (req, res) => {
  const body = _.pick(req.body, ['country_code', 'phone_number']);

  let generatedToken;
  const generateOTP = () => {
    const digits = '0123456789';
    const otpLength = 6;
    let otp = '';
    for (let i = 1; i <= otpLength; i++) {
      let index = Math.floor(Math.random() * digits.length);
      otp = otp + digits[index];
    }
    return (generatedToken = otp);
  };

  generateOTP();

  let expire_date = new Date();
  expire_date.setSeconds(expire_date.getSeconds() + 180);

  let OTP = new verify_code({
    code: generatedToken,
    country_code: body.country_code,
    phone_number: body.phone_number,
    expire: expire_date,
  });

  axios({
    method: 'post',
    url: `https://api.kavenegar.com/v1/61586C4658584D784C367636486352355474555973656A6B41493753647A656B7A4E6F725659657979336F3D/verify/lookup.json?receptor=${
      body.country_code + body.phone_number
    }&token=${generatedToken}&template=veryfyPhone`,
  })
    .then((r) => {
      OTP.save().then(
        (otp) => {
          res.status(200).json({
            Success: `otp created ${otp}`,
          });
        },
        (err) => {
          res.status(400).json({
            Error: `Somthing went wrong ${err}`,
          });
        }
      );
    })
    .catch((err) => {
      res.status(400).json({
        Error: `Failed to send code ${err}`,
      });
    });
});

module.exports = router;
