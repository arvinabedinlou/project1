const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//local
const { user } = require('../../db/model/user');
const {
  complete_information_token,
} = require('../../db/model/complete_information_token');
//variable
let router = express.Router();

router.post('/complete_information', (req, res) => {
  const body = _.pick(req.body, [
    'country_code',
    'phone_number',
    'name',
    'password',
    'os',
    'device_name',
    'ip',
    'pushe_id',
  ]);

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(body.password, salt, (err, hash) => {
      if (hash) {
        user
          .findOne({
            country_code: body.country_code,
            phone_number: body.phone_number,
          })
          .then((user) => {
            if (!user) {
              return Promise.reject();
            }

            if (!user.password && !user.name) {
              if (user.login_information.length < 5) {
                let token = jwt
                  .sign(
                    {
                      _id: user._id.toHexString(),
                    },
                    'arshyan'
                  )
                  .toString();

                user.name = body.name;
                user.password = hash;

                user.login_information.push({
                  token,
                  os: body.os,
                  device_name: body.device_name,
                  ip: body.ip,
                  pushe_id: body.pushe_id,
                });

                user
                  .save()
                  .then((userToken) => {
                    res.header('x-auth', token).status(200).json({
                      message: `Access token Created, User information recorded.`,
                      token,
                    });
                  })
                  .catch((err) => {
                    res.status(400).json({
                      message: `Access token not Created, User information recorded.`,
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
                        token: token,
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
                message: `User information available!`,
                err,
              });
            }
          })
          .catch((err) => {
            res.status(400).json({
              message: `User information not recorded`,
              err,
            });
          });
      }
    });
  });
});

module.exports = router;
