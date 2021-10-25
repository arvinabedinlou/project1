const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb://faramojAdmin:Faramoj1400#@37.152.181.9:27017/arshyanTest?authSource=admin',
  {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  }
);
mongoose.set('useCreateIndex', true);
// mongoose.set('useFindAndModify', false);

module.exports = {
  mongoose,
};
