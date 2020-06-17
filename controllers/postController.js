let Post = require('../models/post');
let Blog = require('../models/blog');
let Comment = require('../models/comment');

let async = require('async');
const { body, validationResult } = require('express-validator');

///
/// POST LIST
///

exports.post_list = function (req, res, next) {
  Post.find({ 'blog': req.body.blogId })
  .exec(function (err, posts) {
    if (err) {
      return next(err);
    }

    res.json({
      title: 'List of posts',
      posts: posts,
    });
  });
};

///
/// POST CREATE GET
///

exports.post_create_get = function (req, res, next) {

};

///
/// POST CREATE POST
///

exports.post_create_post = [
  body('postTitle')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Your post needs a title')
  .escape(),

  body('postContent')
  .trim()
  .isLength({ min: 1 })
  .withMessage('You cannot leave your post empty')
  .escape(),

  (req, res, next) => {
    Blog.findById(req.params.blogId)
    .populate('blogAuthor')
    .exec(function (err, blogForThisPost) {
      if (req.user.id !== blogForThisPost.blogAuthor.id) {
        return res.status(400);
      } else {
        const errors = validationResult(req);

        let post = new Post({
          blog: blogForThisPost.id,
          postAuthor: req.user.id,
          postTitle: req.body.postTitle,
          postContent: req.body.postContent,
          date: new Date(),
          published: req.body.published,     /// has to be part of the form (boolean)
        });

        if (!errors.isEmpty()) {
          res.status(400).json({ errors: errors.array() });
        } else {
          post.save(err => {
            if (err) {
              return next(err);
            }

            res.json(post);
          });
        }
      }
    });
  },
];

///
/// POST DELETE
///

exports.post_delete_delete = function (req, res, next) {
  async.parallel({
    post: function (callback) {
      Post.findById(req.params.id)
      .exec(callback);
    },

    commentsOfPost: function (callback) {
      Comment.find({ 'commentedPost': req.params.id })
      .exec(callback);
    },

  }, function (err, results) {
    if (err) {
      return next(err);
    } else {
      Post.findByIdAndRemove(req.params.id, function deletePost(err) {
        if (err) {
          return next(err);
        }

        results.commentsOfPost.forEach((comment) => {
          Comment.findByIdAndRemove(comment.id, function deleteComment(err) {
            if (err) {
              return next(err);
            }
          });
        });

        res.sendStatus(200);
      });

    }
  });
};

///
/// POST UPDATE GET
///

exports.post_update_get = function (req, res, next) {

};

///
/// POST UPDATE PUT
///

exports.post_update_put = [
  body('postTitle')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Your post needs a title')
  .escape(),

  body('postContent')
  .trim()
  .isLength({ min: 1 })
  .withMessage('You cannot leave your post empty')
  .escape(),

  (req, res, next) => {

    Post.findById(req.params.id)
    .exec(function (err, postToUpdate) {

      const errors = validationResult(req);

      let post = new Post({
        blog: postToUpdate.blog,
        postAuthor: req.user.id,
        postTitle: req.body.postTitle,
        postContent: req.body.postContent,
        date: postToUpdate.date,
        published: postToUpdate.published,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        Post.findByIdAndUpdate(req.params.id, post, {}, function (err, updatedPost) {
          if (err) {
            return next(err);
          }

          res.json(post);
        });
      }
    });

  },
];

///
/// POST DETAIL
///

exports.post_detail = function (req, res, next) {
  Post.findById(req.params.id)
  .exec(function (err, post) {
    if (err) {
      return next(err);
    }

    res.json(post);
  });
};
