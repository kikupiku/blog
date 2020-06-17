var express = require('express');
var router = express.Router();

let userController = require('../controllers/userController');
let blogController = require('../controllers/blogController');
let postController = require('../controllers/postController');
let commentController = require('../controllers/commentController');

let passport = require('../passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/// USER ROUTES ///

router.get('/users', userController.user_list);
// router.get('/users/create', userController.user_create_get);
router.post('/users/login', userController.user_login);
                                                    //do i need a logout post/get?
router.post('/users', userController.user_create_post);
router.delete('/users/:id', userController.user_delete_delete);
// router.get('/users/:id/update', userController.user_update_get);
router.put('/users/:id', userController.user_update_put);
router.get('/users/:id', userController.user_detail);

/// BLOG ROUTES ///

router.get('/users/:userId/blogs', blogController.blog_list);
// router.get('/users/:userId/blogs/create', blogController.blog_create_get);
router.post('/users/:userId/blogs', passport.authenticate('jwt', {
  session: false,
}), blogController.blog_create_post);
router.delete('/users/:userId/blogs/:id', passport.authenticate('jwt', {
  session: false,
}), blogController.blog_delete_delete);
// router.get('/users/:userId/blogs/:id/update', blogController.blog_update_get);
router.put('/users/:userId/blogs/:id', passport.authenticate('jwt', {
  session: false,
}), blogController.blog_update_put);
router.get('/users/:userId/blogs/:id', blogController.blog_detail);

/// POST ROUTES ///

router.get('/blogs/:blogId/posts', postController.post_list);
// router.get('/blogs/:blogId/posts/create', postController.post_create_get);
router.post('/blogs/:blogId/posts', passport.authenticate('jwt', {
  session: false,
}), postController.post_create_post);
router.delete('/blogs/:blogId/posts/:id', passport.authenticate('jwt', {
  session: false,
}), postController.post_delete_delete);
// router.get('/blogs/:blogId/posts/:id/update', postController.post_update_get);
router.put('/blogs/:blogId/posts/:id', passport.authenticate('jwt', {
  session: false,
}), postController.post_update_put);
router.get('/blogs/:blogId/posts/:id', postController.post_detail);

/// COMMENT ROUTES ///

// router.get('/posts/:postId/comments/create', commentController.comment_create_get);
router.post('/blogs/:blogId/posts/:postId/comments', passport.authenticate('jwt', {
  session: false,
}), commentController.comment_create_post);
router.delete('/blogs/:blogId/posts/:postId/comments/:id', passport.authenticate('jwt', {
  session: false,
}), commentController.comment_delete_delete);
// router.get('/posts/:postId/comments/:id/update', commentController.comment_update_get);
router.put('/blogs/:blogId/posts/:postId/comments/:id', passport.authenticate('jwt', {
  session: false,
}), commentController.comment_update_put);

module.exports = router;
