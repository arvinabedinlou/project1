var express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
//local
const { verify_code } = require('../../db/model/verify_code');
const {
  complete_information_token,
} = require('../../db/model/complete_information_token');
const { user } = require('../../db/model/user');
//variable
let router = express.Router();

router.post('/verify_phone', (req, res) => {
  const body = _.pick(req.body, [
    'code',
    'country_code',
    'phone_number',
    'os',
    'device_name',
    'ip',
    'pushe_id',
  ]);

  verify_code
    .findOne({
      code: body.code,
      country_code: body.country_code,
      phone_number: body.phone_number,
    })
    .then((verifyCode) => {
      if (verifyCode) {
        if (verifyCode.expire > new Date()) {
          user
            .findOne({
              country_code: body.country_code,
              phone_number: body.phone_number,
            })
            .then((user) => {
              if (!user) {
                return Promise.reject();
              }

              if (user.name && user.password) {
                if (user.login_information.length < 5) {
                  let token = jwt
                    .sign(
                      {
                        _id: user._id.toHexString(),
                      },
                      'arshyan'
                    )
                    .toString();

                  user.login_information.push({
                    token,
                    os: body.OS,
                    device_name: body.device_name,
                    ip: body.ip,
                    pushe_id: body.pushe_id,
                  });

                  user
                    .save()
                    .then((userToken) => {
                      res.header('x-auth', token).status(200).json({
                        message: `Access token Created, User available, User information available.`,
                        token,
                      });
                    })
                    .catch((err) => {
                      res.status(400).json({
                        message: `Access token not Created, User available, User information available.`,
                        err,
                      });
                    });
                } else {
                  complete_information_token
                    .findOne({
                      country_code: body.country_code,
                      phone_number: body.phone_number,
                    })
                    .then((data) => {
                      if (!data) {
                        return Promise.reject();
                      }
                      res.header('x-auth', data.Token).status(200).json({
                        message: `You may not have more than 5 tokens per login, Access token availabale.`,
                        token: data.Token,
                      });
                    })
                    .catch((error) => {
                      let expire_date = new Date();
                      expire_date.setSeconds(expire_date.getSeconds() + 300);
                      let token = jwt
                        .sign(
                          {
                            _id: user._id.toHexString(),
                          },
                          'arshyan'
                        )
                        .toString();

                      let completeInformationToken =
                        new complete_information_token({
                          token,
                          country_code: body.country_code,
                          phone_number: body.phone_number,
                          expire: expire_date,
                        });

                      completeInformationToken.save().then(
                        (completeInformationToken) => {
                          res.header('x-auth', token).status(200).json({
                            message: `You may not have more than 5 tokens per login, Access token created.`,
                            token,
                          });
                        },
                        (err) => {
                          res.status(400).json({
                            message: `You may not have more than 5 tokens per login, Access token not created.`,
                            err,
                          });
                        }
                      );
                    });
                }
              } else {
                res.status(400).json({
                  message: `Access token not Created, User available, No user information.`,
                });
              }
            })
            .catch((err) => {
              let createUser = new user({
                country_code: body.country_code,
                phone_number: body.phone_number,
                creation_date: new Date(),
              });
              createUser
                .save()
                .then((user) => {
                  res.status(200).json({
                    message: `User created.`,
                  });
                })
                .catch((err) => {
                  res.status(400).json({
                    message: `User not created.`,
                    err,
                  });
                });
            });
        } else {
          res.status(400).json({
            message: `Verify code expired.`,
          });
        }
      } else {
        res.status(400).json({
          message: `Verify code not valid or expired.`,
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        message: `Verify code not valid.`,
      });
    });
});

module.exports = router;
