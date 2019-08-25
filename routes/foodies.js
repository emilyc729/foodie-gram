var express = require('express');
var router = express.Router();
var foodiesCtrl = require('../controllers/foodies');

//GET: show all posts
router.get('/foodies', foodiesCtrl.index);
//GET: new post page
router.get('/foodies/new', isLoggedIn, foodiesCtrl.new);
//GET: show logged in user's post & profile
router.get('/foodies/profile', isLoggedIn, foodiesCtrl.profile);
router.get('/foodies/my-posts', isLoggedIn, foodiesCtrl.ownPosts);
//GET: show one post details
router.get('/foodies/:id', foodiesCtrl.postDetails);

//POST: create new post
router.post('/foodies', foodiesCtrl.create);

//DELETE: remove a post
//router.delete('/foodies/:id', isLoggedIn, foodiesCtrl.deletePost);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  //if not logged in -> redirect to log-in
  res.redirect('/auth/google');
}

module.exports = router;
