const mongoose = require('mongoose');
const ResponseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: Object,
  meta: Object
});
module.exports = mongoose.model('Response', ResponseSchema);
