let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostSchema = new Schema({
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  postAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postTitle: { type: String, required: true, max: 100 },
  postContent: { type: String, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  date: { type: Date },
  published: { type: Boolean, default: true },
});

PostSchema
.virtual('url')
.get(function () {
  return '/posts/' + this._id;
});

module.exports = mongoose.model('Post', PostSchema);
