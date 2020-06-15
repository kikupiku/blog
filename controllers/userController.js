let User = require('../models/user');

let async = require('async');
const validator = require('express-validator');

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

exports.user_create_post = function (req, res, next) {

};

///
/// USER DELETE
///

exports.user_delete_delete = function (req, res, next) {

};

///
/// USER UPDATE GET
///

exports.user_update_get = function (req, res, next) {

};

///
/// USER UPDATE PUT
///

exports.user_update_put = function (req, res, next) {

};

///
/// USER DETAIL
///

exports.user_detail = function (req, res, next) {

};
