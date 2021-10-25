//local
const { mongoose } = require('../mongoose');

let complete_information_token_schema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      minlength: 10,
      required: true,
    },
    expire: {
      type: Date,
    },
  }
  // { timestamps: true }
);

complete_information_token_schema.index(
  { expire: 1 },
  { expireAfterSeconds: 0 }
);

let complete_information_token = mongoose.model(
  'complete_information_token',
  complete_information_token_schema
);

module.exports = {
  complete_information_token,
};
