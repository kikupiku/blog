let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema({
  commentedPost: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
  blogOfCommentedPost: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  commentAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentContent: { type: String, required: true },
  commentDate: { type: Date },
});

module.exports = mongoose.model('Comment', CommentSchema);
