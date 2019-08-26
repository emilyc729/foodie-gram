var express = require('express');
var router = express.Router();
var foodiesCtrl = require('../controllers/foodies');

//GET: show all posts
router.get('/foodies', isLoggedIn, foodiesCtrl.index);
//GET: new post page
router.get('/foodies/new', isLoggedIn, foodiesCtrl.new);
//GET: show logged in user's post & profile
router.get('/foodies/profile', isLoggedIn, foodiesCtrl.profile);
router.get('/foodies/my-posts', isLoggedIn, foodiesCtrl.ownPosts);
//GET: show one post details
router.get('/foodies/:id', foodiesCtrl.postDetails);
router.get('/foodies/:id/edit-post', foodiesCtrl.editPost);

//POST: create new post
router.post('/foodies', foodiesCtrl.create);

//PUT: edit post
router.put('/:id', foodiesCtrl.updatePost);

//DELETE: remove a post
router.delete('/:id', foodiesCtrl.deletePost);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  //if not logged in -> redirect to log-in
  res.redirect('/auth/google');
}

module.exports = router;
