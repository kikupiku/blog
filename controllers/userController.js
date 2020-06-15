let User = require('../models/user');
let Blog = require('../models/blog');
let Post = require('../models/post');
let Comment = require('../models/comment');

let async = require('async');
const { body, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');
const passport = require('../passport');
const bcrypt = require('bcryptjs');

///
/// USER LIST
///

exports.user_list = function (req, res, next) {
  User.find({})
  .sort([['lastName', 'ascending']])
  .exec(function (err, users) {
    if (err) {
      return next(err);
    }

    res.json({
      title: 'List of users',
      users: users,
    });
  });
};

///
/// USER CREATE GET
///

exports.user_create_get = function (req, res, next) {

};

///
/// USER CREATE POST
///

exports.user_create_post = [
  body('firstName')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Please enter your first name')
  .escape(),

  body('lastName')
  .trim()
  .isLength({ min: 1 })
  .withMessage('You cannot leave your last name empty')
  .escape(),

  body('email')
  .trim()
  .isEmail()
  .withMessage('It has to be a real email address'),

  body('password')
  .trim()
  .isLength({ min: 5 })
  .withMessage('Your password needs to be at least 5 characters long'),

  (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const errors = validationResult(req);

      let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      });

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        user.save(err => {
            if (err) {
              return next(err);
            }

            res.json(user.attributes);
          });
      }
    });
  },
];

///
/// USER LOGIN
///

exports.user_login = [
  (req, res, next) => {

    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user: user,
        });
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          res.send(err);
        }

        const token = jwt.sign(user.attributes, process.env.SECRET_JWT_KEY);

        return res.json({ user, token });
      });
    })(req, res);
  },
];

///
/// USER DELETE
///

exports.user_delete_delete = function (req, res, next) {
  async.parallel({
    user: function (callback) {
      User.findById(req.params.id)
      .exec(callback);
    },

    blogsOfUser: function (callback) {
      Blog.find({ 'blogAuthor': req.params.id })
      .populate('blogAuthor')
      .exec(callback);
    },

    postsOfUser: function (callback) {
      Post.find({ 'postAuthor': req.params.id })
      .populate('postAuthor')
      .populate('comments')
      .exec(callback);
    },

  }, function (err, results) {
    if (err) {
      return next(err);
    } else {
      User.findByIdAndRemove(req.params.id, function deleteUser(err) {
        if (err) {
          return next(err);
        }
                               // soooooo, if I don't redirect, I do nothing here??
                               // also, is it ok that I delete all trace of this user's activity like this?
      });
      results.blogsOfUser.forEach((blog) => {
        Blog.findByIdAndRemove(blog.id, function deleteBlog(err) {
          if (err) {
            return next(err);
          }
        });
      });
      results.postsOfUser.forEach((post) => {
        post.comments.forEach((comment) => {
          Comment.findByIdAndRemove(comment.id, function deleteComment(err) {
            if (err) {
              return next(err);
            }
          });
        });

        Post.findByIdAndRemove(post.id, function deletePost(err) {
          if (err) {
            return next(err);
          }
        });
      });

    }
  });
};

///
/// USER UPDATE GET
///

exports.user_update_get = function (req, res, next) {

};

///
/// USER UPDATE PUT
///

exports.user_update_put = [
  body('firstName')
  .trim()
  .isLength({ min: 1 })
  .withMessage('Please enter your first name')
  .escape(),

  body('lastName')
  .trim()
  .isLength({ min: 1 })
  .withMessage('You cannot leave your last name empty')
  .escape(),

  body('email')
  .trim()
  .isEmail()
  .withMessage('It has to be a real email address'),

  body('password')
  .trim()
  .isLength({ min: 5 })
  .withMessage('Your password needs to be at least 5 characters long'),

  (req, res, next) => {

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const errors = validationResult(req);

      let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        User.findByIdAndUpdate(req.params.id, user, {}, function (err, updatedUser) {
            if (err) {
              return next(err);
            }

            res.json(updatedUser.attributes);
          });
      }
    });
  },
];

///
/// USER DETAIL
///

exports.user_detail = function (req, res, next) {
  User.findById(req.params.id)
  .exec(function (err, user) {
    if (err) {
      return next(err);
    }

    res.json(user.attributes);
  });
};
