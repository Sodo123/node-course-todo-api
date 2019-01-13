var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MongoBD_URI);

module.exports = {mongoose};
