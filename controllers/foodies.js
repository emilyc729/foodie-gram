const Foodie = require('../models/foodie');
module.exports = {
    index,
    create,
    new: newPost,
    ownPosts
};

function index(req, res, next) {
 
    Foodie.find({}, function(err, foodies) {
        
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
        if(err) return next(err);
        res.redirect('foodies');
      });

}

function newPost(req, res, next) {
    res.render('foodies/new-post');
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