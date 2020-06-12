let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let CommentSchema = new Schema({
  commentAuthor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  commentContent: { type: String, required: true },
  commentDate: { type: Date },
});

module.exports = mongoole.model('Comment', CommentSchema);
