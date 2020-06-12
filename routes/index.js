var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/// USER ROUTES ///

router.get('/users', userController.user_list);
router.get('/users/create', userController.user_create_get);
router.post('/users/create', userController.user_create_post);
router.get('/users/:id/delete', userController.user_delete_get);
router.delete('/users/:id/delete', userController.user_delete_delete);
router.get('/users/:id/update', userController.user_update_get);
router.put('/users/:id/update', userController.user_update_put);
router.get('/users/:id', userController.user_detail);

/// BLOG ROUTES ///

router.get('/blogs', blogController.blog_list);       /// is this url right? or /users/:userId/blogs
router.get('/blogs/create', blogController.blog_create_get);
router.post('/blogs/create', blogController.blog_create_post);
router.get('/blogs/:id/delete', blogController.blog_delete_get);
router.delete('/blogs/:id/delete', blogController.blog_delete_delete);
router.get('/blogs/:id/update', blogController.blog_update_get);
router.put('/blogs/:id/update', blogController.blog_update_put);
router.get('/blogs/:id', blogController.blog_detail);

/// POST ROUTES ///

router.get('/blogs/:blogId/posts', postController.post_list);         ///is this url right?
router.get('/blogs/:blogId/posts/create', postController.post_create_get);
router.post('/blogs/:blogId/posts/create', postController.post_create_post);
router.get('/blogs/:blogId/posts/:id/delete', postController.post_delete_get);
router.delete('/blogs/:blogId/posts/:id/delete', postController.post_delete_delete);
router.get('/blogs/:blogId/posts/:id/update', postController.post_update_get);
router.put('/blogs/:blogId/posts/:id/update', postController.post_update_put);
router.get('/blogs/:blogId/posts/:id', postController.post_detail);

/// COMMENT ROUTES ///

//no detail because I don't want that possibility, is that ok?----------------
router.get('/blog/create', blogController.blog_create_get);
router.post('/blog/create', blogController.blog_create_post);
router.get('/blog/:id/delete', blogController.blog_delete_get);
router.delete('/blog/:id/delete', blogController.blog_delete_delete);
router.get('/blog/:id/update', blogController.blog_update_get);
router.put('/blog/:id/update', blogController.blog_update_put);

module.exports = router;
