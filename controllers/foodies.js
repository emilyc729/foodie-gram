const Foodie = require('../models/foodie');

module.exports = {
    index,
    create,
    new: newPost,
    ownPosts,
    profile, 
    postDetails
};

function index(req, res, next) {
 
    Foodie.find({}, function(err, foodies) {
        //foodies.find({''})
        
            res.render('foodies/index', {
                foodies,
                user: req.user,
                name: req.query.name
            });

    
    });
}

function create(req, res, next) {
    req.user.posts.push(req.body);
    req.user.save(function(err) {
        console.log(req.user);
        if(err) return next(err);
        res.redirect('foodies/profile');
      });

}

function newPost(req, res, next) {
    res.render('foodies/new-post', {user: req.user});
}

function ownPosts(req, res, next) {
    console.log(req.user.name);
    Foodie.findOne({'_id': req.user.id}, function(err, foodie){
       
        res.render('foodies/my-posts', {
            foodie,
            user: req.user,
            name: req.query.name
        });
    });

   
}

function profile(req, res, next) {
    Foodie.findOne({'_id': req.user.id}, function(err, foodie){
        res.render('foodies/profile', {
            foodie,
            user: req.user,
            name: req.query.name
        });
    });
}


function postDetails(req, res, next) {
    /*
    Foodie.findOne(req.params.id, function(err, one) {

        res.render('foodies/details', {
            onePost, 
            user: req.user,
            name: req.query.name
        });
    });
    */
}