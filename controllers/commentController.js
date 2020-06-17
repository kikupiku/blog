let Comment = require('../models/comment');

let async = require('async');
const { body, validationResult } = require('express-validator');

///
/// COMMENT CREATE GET
///

exports.comment_create_get = function (req, res, next) {

};

///
/// COMMENT CREATE POST
///

exports.comment_create_post = [
  body('commentContent')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Empty comments are not comments')
  .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    let comment = new Comment({
      commentedPost: req.params.postId,
      blogOfCommentedPost: req.params.blogId,
      commentAuthor: req.user.id,
      commentContent: req.body.commentContent,
      commentDate: new Date(),
    });

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      comment.save(err => {
        if (err) {
          return next(err);
        }

        res.json(comment);
      });
    }
  },
];

///
/// COMMENT DELETE
///

exports.comment_delete_delete = function (req, res, next) {
  Comment.findById(req.params.id)
  .exec(function (err, commentToDelete) {
    if (err) {
      return next(err);
    } else if (!commentToDelete) {
      res.sendStatus(404);
    } else {
      Comment.findByIdAndRemove(req.params.id, function deleteUser(err) {
        if (err) {
          return next(err);
        }

        res.sendStatus(200);
      });
    }
  });
};

///
/// COMMENT UPDATE GET
///

exports.comment_update_get = function (req, res, next) {

};

///
/// COMMENT UPDATE PUT
///

exports.comment_update_put = [
  body('commentContent')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Empty comments are not comments')
  .escape(),

  (req, res, next) => {

    Comment.findById(req.params.id)
    .exec(function (err, commentToUpdate) {

      const errors = validationResult(req);

      let comment = new Comment({
        commentedPost: req.params.postId,
        blogOfCommentedPost: req.params.blogId,
        commentAuthor: req.user.id,
        commentContent: req.body.commentContent,
        commentDate: commentToUpdate.commentDate,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        Comment.findByIdAndUpdate(req.params.id, comment, {}, function (err, updatedComment) {
          if (err) {
            return next(err);
          }

          res.json(comment);
        });
      }
    });
  },
];
