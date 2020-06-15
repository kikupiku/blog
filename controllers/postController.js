let Post = require('../models/post');

let async = require('async');
const validator = require('express-validator');

///
/// POST LIST
///

exports.post_list = function (req, res, next) {
  Post.find({})
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

exports.post_create_post = function (req, res, next) {

};

///
/// POST DELETE
///

exports.post_delete_delete = function (req, res, next) {

};

///
/// POST UPDATE GET
///

exports.post_update_get = function (req, res, next) {

};

///
/// POST UPDATE PUT
///

exports.post_update_put = function (req, res, next) {

};

///
/// POST DETAIL
///

exports.post_detail = function (req, res, next) {

};
