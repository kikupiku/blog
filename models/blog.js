let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BlogSchema = new Schema({
  blogAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blogTopic: { type: String, required: true },
  blogDescription: { type: String, required: false },
});

BlogSchema
.virtual('url')
.get(function () {
  return '/blogs/' + this._id;
});

module.exports = mongoose.model('Blog', BlogSchema);
