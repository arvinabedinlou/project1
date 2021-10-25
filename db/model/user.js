//local
const { mongoose } = require('../mongoose');

let user_schema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 1,
    trim: true,
  },
  country_code: {
    type: String,
  },
  phone_number: {
    type: String,
    minlength: 10,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    minlength: 5,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    minlength: 8,
  },

  roll: {
    //admin,user
    type: String,
  },
  login_information: [
    {
      token: {
        type: String,
        required: true,
      },
      os: {
        type: String,
      },
      device_name: {
        type: String,
      },
      ip: {
        type: String,
      },
      pushe_id: {
        type: String,
      },
    },
  ],
  products: [
    {
      _id: false,
      product_id: {
        type: String,
      },
      payment: { type: Boolean },
      support_all_payment: {
        type: Boolean,
      },
      term_ids: [
        {
          term_id: {
            type: String,
          },
          payment: { type: Boolean },
          support_payment: {
            type: Boolean,
          },
        },
      ],
    },
  ],
  cart: [
    {
      _id: false,
      product_id: {
        type: String,
      },
      product_payment: { type: Boolean },
      support_all_payment: {
        type: Boolean,
      },
      term1_id: {
        type: String,
      },
      term1_payment: { type: Boolean },
      term1_support_payment: {
        type: Boolean,
      },
    },
  ],
  payments: [
    {
      products: [
        {
          _id: false,
          product_id: {
            type: String,
          },
          term1_id: {
            type: String,
          },
          cart_info: {
            support_type: {
              type: String,
            },
            support_price: {
              type: Number,
            },
            product_type: {
              type: String,
            },
            product_price: {
              type: Number,
            },
            final_price: {
              type: Number,
            },
          },
        },
      ],
      card_hash: {
        type: String,
      },
      card_pan: {
        type: String,
      },
      ref_id: {
        type: String,
      },
      fee_type: {
        type: String,
      },
      fee: {
        type: String,
      },
      message: {
        type: String,
      },
      status: {
        type: Boolean,
      },
      price: {
        type: Number,
      },
      authority: {
        type: String,
      },
    },
  ],
  creation_date: {
    type: Date,
  },
  update_date: {
    type: Date,
  },
});

let user = mongoose.model('user', user_schema);

module.exports = {
  user,
};
