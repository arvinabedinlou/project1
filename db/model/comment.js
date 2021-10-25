//local
const { mongoose } = require('../mongoose');

let comment_schema = new mongoose.Schema({
  product_id: {
    type: String,
    require: true,
  },
  user_info: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
    require: true,
  },
  rate: {
    type: Number,
    require: true,
  },
  creation_date: {
    type: Date,
  },
});

let comment = mongoose.model('comment', comment_schema);

module.exports = {
  comment,
};
