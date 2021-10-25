//local
const { mongoose } = require('../mongoose');

let product_schema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  cover_img: {
    name: {
      type: String,
      require: true,
    },
    mimetype: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      require: true,
    },
  },
  cover_video: {
    name: {
      type: String,
      require: true,
    },
    mimetype: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      require: true,
    },
  },
  content_img: {
    name: {
      type: String,
      require: true,
    },
    mimetype: {
      type: String,
      require: true,
    },
    size: {
      type: String,
      require: true,
    },
  },
  type: {
    type: String,
    require: true,
  },
  little_description: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  discount: {
    type: Number,
  },
  box1: {
    title: { type: String },
    description: { type: String },
  },
  box2: {
    title: { type: String },
    description: { type: String },
  },
  box3: {
    title: { type: String },
    description: { type: String },
  },
  box4: {
    title: { type: String },
    description: { type: String },
  },
  box5: {
    title: { type: String },
    description: { type: String },
  },
  box6: {
    title: { type: String },
    description: { type: String },
  },
  support_price: {
    type: Number,
  },
  rate: {
    type: Number,
  },
  terms: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      price: {
        type: Number,
      },
      support_price: {
        type: Number,
      },
      files: [
        {
          name: {
            type: String,
          },
          mimetype: {
            type: String,
          },
          size: {
            type: String,
          },
        },
      ],
    },
  ],
  creation_date: {
    type: Date,
    default: Date.now,
  },
  update_date: {
    type: Date,
  },
});

let product = mongoose.model('product', product_schema);

module.exports = {
  product,
};
