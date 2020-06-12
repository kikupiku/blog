let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let BlogSchema = new Schema({
  blogAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blogTopic: { type: String, required: true },
});

BlogSchema
.virtual('url')
.get(function () {
  return '/blogs/' + this._id;
});

module.exports = mongoole.model('Blog', BlogSchema);
