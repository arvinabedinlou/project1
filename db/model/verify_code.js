//local
const { mongoose } = require('../mongoose');

let verify_code_schema = new mongoose.Schema(
  {
    code: {
      type: Number,
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

verify_code_schema.index({ expire: 1 }, { expireAfterSeconds: 0 });

let verify_code = mongoose.model('verify_code', verify_code_schema);

module.exports = {
  verify_code,
};
