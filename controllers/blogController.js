let Blog = require('../models/blog');

let async = require('async');
const validator = require('express-validator');

///
/// BLOG LIST
///

exports.blog_list = function (req, res, next) {
  Blog.find({})
  .sort([['blogTopic', 'ascending']])
  .exec(function (err, blogs) {
    if (err) {
      return next(err);
    }

    res.json({
      title: 'List of blogs',
      blogs: blogs,
    });
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

exports.blog_create_post = function (req, res, next) {

};

///
/// BLOG DELETE
///

exports.blog_delete_delete = function (req, res, next) {

};

///
/// BLOG UPDATE GET
///

exports.blog_update_get = function (req, res, next) {

};

///
/// BLOG UPDATE PUT
///

exports.blog_update_put = function (req, res, next) {

};

///
/// BLOG DETAIL
///

exports.blog_detail = function (req, res, next) {

};
