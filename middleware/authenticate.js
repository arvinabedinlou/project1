const jwt = require('jsonwebtoken');
//local
const { user } = require('../db/model/user');

let authenticate = (req, res, next) => {
  let token = req.header('x-auth');
  let decoded;

  if (token) {
    try {
      decoded = jwt.verify(token, 'arshyan');

      user
        .findOne({
          _id: decoded._id,
          'login_information.token': token,
        })
        .then((user) => {
          if (!user) {
            return Promise.reject();
          }
          next();
        })
        .catch((err) => {
          res.status(401).json({
            Error: `Token not valid.`,
            err,
          });
        });
    } catch (error) {
      res.status(401).json({
        Error: `Token not valid.`,
        error,
      });
    }
  } else {
    res.status(400).json({
      Error: `enter a token, token not found!`,
    });
  }
};

module.exports = {
  authenticate,
};
