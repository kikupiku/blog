let Blog = require('../models/blog');
let Post = require('../models/post');
let Comment = require('../models/comment');

let async = require('async');
const { body, validationResult } = require('express-validator');

///
/// BLOG LIST
///

exports.blog_list = function (req, res, next) {
  Blog.find({ 'blogAuthor': req.params.userId })
  .populate('blogAuthor')
  .sort([['blogTopic', 'ascending']])
  .exec(function (err, blogs) {
    if (err) {
      return next(err);
    }
    if (blogs.length === 0) {
      res.sendStatus(404);
    } else {

      let author = blogs[0].blogAuthor.fullName;
      let decoratedBlogs = blogs.map(blog => {
        return {
          _id: blog.id,
          blogAuthor: {
            _id: blog.blogAuthor.id,
            firstName: blog.blogAuthor.firstName,
            lastName: blog.blogAuthor.lastName,
            email: blog.blogAuthor.email,
          },
          blogTopic: blog.blogTopic,
          blogDescription: blog.blogDescription,
        };
      });

      res.json({
        author: author,
        title: 'List of blogs',
        blogs: decoratedBlogs,
      });
    }
  });
};

///
/// BLOG CREATE GET
///

exports.blog_create_get = function (req, res, next) {

};

///
/// BLOG CREATE POST
///

exports.blog_create_post = [
  body('blogTopic')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Your blog needs a title')
  .escape(),

  body('blogDescription')
  .trim()
  .escape(),

  (req, res, next) => {

    if (req.user.id !== req.params.userId) {
      return res.status(400);
    } else {

      const errors = validationResult(req);

      let blog = new Blog({
        blogAuthor: req.user.id,
        blogTopic: req.body.blogTopic,
        blogDescription: req.body.blogDescription,
      });

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        blog.save(err => {
          if (err) {
            return next(err);
          }

          res.json(blog);
        });
      }
    }
  },
];

///
/// BLOG DELETE
///

exports.blog_delete_delete = function (req, res, next) {
  async.parallel({
    blog: function (callback) {
      Blog.findById(req.params.id)
      .exec(callback);
    },

    postsOfBlog: function (callback) {
      Post.find({ 'blog': req.params.id })
      .exec(callback);
    },

    commentsToPostsOfBlog: function (callback) {
      Comment.find({ 'blogOfCommentedPost': req.params.id })
      .exec(callback);
    },

  }, function (err, results) {

    if (err) {
      return next(err);
    } else {
      Blog.findByIdAndRemove(req.params.id, function deleteBlog(err) {
        if (err) {
          return next(err);
        }

        results.postsOfBlog.forEach((post) => {
          Post.findByIdAndRemove(post.id, function deletePost(err) {
            if (err) {
              return next(err);
            }
          });
        });
        results.commentsToPostsOfBlog.forEach((comment) => {
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
/// BLOG UPDATE GET
///

exports.blog_update_get = function (req, res, next) {

};

///
/// BLOG UPDATE PUT
///

exports.blog_update_put = [
  body('blogTopic')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Your blog needs a title')
  .escape(),

  body('blogDescription')
  .trim()
  .escape(),

  (req, res, next) => {

    if (req.user.id !== req.params.userId) {
      return res.status(400);
    } else {
      const errors = validationResult(req);

      let blog = new Blog({
        blogAuthor: req.user,
        blogTopic: req.body.blogTopic,
        blogDescription: req.body.blogDescription,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        Blog.findByIdAndUpdate(req.params.id, blog, {}, function (err, updatedBlog) {
          if (err) {
            return next(err);
          }

          res.json(blog);
        });
      }
    }
  },
];

///
/// BLOG DETAIL
///

exports.blog_detail = function (req, res, next) {
  Blog.findById(req.params.id)
  .exec(function (err, blog) {
    if (err) {
      return next(err);
    }

    res.json(blog);
  });
};
