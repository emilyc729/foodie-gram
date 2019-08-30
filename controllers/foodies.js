const Foodie = require('../models/foodie');
var formidable = require("formidable");
var fs = require("fs");

module.exports = {
    index,
    create,
    new: newPost,
    ownPosts,
    profile,
    postDetails,
    deletePost,
    editPost,
    updatePost,
    addComment,
    deleteComment
};

function index(req, res, next) {

    let search = req.query.foodInfo ? new RegExp(req.query.foodInfo, 'i') : '';
    let sort = req.query.sort || '';

    let foundPosts = [];

    if (search != '' && sort != '') {
        allPostsSearchAndSort(req, res, search, sort);
    } else if (search === '' && sort != '') {
        allPostsSortBy(req, res, sort);
    } else if (search !== '' && sort === '') {
        allPostsSearchBy(req, res, search);
    } else {
        Foodie.find({}, function (err, foodies) {
            Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
                res.render('foodies/index', {
                    foodie,
                    foodies,
                    user: req.user,
                    foundPosts
                });
            });
        });
    }
}

function create(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (error, fields, files) {
        var input = fields;
        fs.writeFileSync(`public/images/${files.photo.name}`, fs.readFileSync(files.photo.path));
        var photoPath = `/images/${files.photo.name}`;
        input.photo = photoPath;
        req.user.posts.push(input);
        req.user.save(function (err) {
            if (err) return next(err);
            res.redirect('foodies/profile');
        });
    });
}

function newPost(req, res, next) {
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        res.render('foodies/new-post', {
            foodie,
            user: req.user,
            name: req.query.name
        });
    });
}

function ownPosts(req, res, next) {
    console.log(req.user.name);
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        res.render('foodies/my-posts', {
            foodie,
            user: req.user,
            name: req.query.name
        });
    });


}

function profileSearchAndSort(req, res, search, sort) {
    let foundPosts = [];
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost, idx) {
            if (onePost.restaurantName.match(search) || onePost.cuisine.match(search) || foodie.username.match(search)) {
                foundPosts.push(onePost);
            }
        });
        if (sort === 'rating') {
            foundPosts.sort((a, b) => b.rating - a.rating);
        } else {
            foundPosts.sort((a, b) => b.updatedAt - a.updatedAt);
        }

        //console.log(foundPosts);
        res.render('foodies/profile', {
            foodie,
            user: req.user,
            foodInfo: req.query.foodInfo,
            foundPosts
        });
    });

}

function profileSortBy(req, res, sort) {
    let foundPosts = [];
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {

        if (sort === 'rating') {
            foundPosts = foodie.posts.sort((a, b) => b.rating - a.rating);
        } else if (sort === 'updatedAt') {
            foundPosts = foodie.posts.sort((a, b) => b.updatedAt - a.updatedAt);
        }

        console.log(foundPosts + '\n');
        res.render('foodies/profile', {
            foodie,
            user: req.user,
            foodInfo: req.query.foodInfo,
            foundPosts
        });
    });

}

function profileSearchBy(req, res, search) {
    let foundPosts = [];
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost, idx) {
            if (onePost.restaurantName.match(search) || onePost.cuisine.match(search)) {
                foundPosts.push(onePost);
            }

        });

        console.log(typeof foundPosts);
        res.render('foodies/profile', {
            foodie,
            user: req.user,
            foodInfo: req.query.foodInfo,
            foundPosts
        });
    });
}

function profile(req, res, next) {
    console.log(req.query);
    let search = req.query.foodInfo ? new RegExp(req.query.foodInfo, 'i') : '';
    let sort = req.query.sort || '';
    console.log(sort);
    console.log(search);
    let foundPosts = [];
    console.log(typeof foundPosts);
    if (search != '' && sort != '') {
        profileSearchAndSort(req, res, search, sort);
    } else if (search === '' && sort != '') {
        profileSortBy(req, res, sort);
    } else if (search !== '' && sort === '') {
        profileSearchBy(req, res, search);
    } else {
        console.log(typeof foundPosts);
        Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
            res.render('foodies/profile', {
                foodie,
                user: req.user,
                foodInfo: req.query.foodInfo,
                foundPosts
            });
        });
    }

}



function postDetails(req, res, next) {

    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost) {
                if (onePost.id === req.params.id) {
                    res.render('foodies/details', {
                        foodie,
                        onePost,
                        user: req.user,
                        name: req.query.name
                    });
                }
            });
        });
    });
}

function deletePost(req, res, next) {
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost, idx) {
            if (req.params.id === onePost.id) {
                foodie.posts.splice(idx, 1);
                foodie.save(function (err) {
                    res.redirect('foodies/profile');
                });
            }
        });
    });
}

function editPost(req, res, next) {
    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {

                res.render('foodies/edit-post', {
                    foodie,
                    onePost,
                    user: req.user,
                    name: req.query.name
                });
            }
        });
    });
}

function updatePost(req, res, next) {

    Foodie.findOne({ '_id': req.user.id }, function (err, foodie) {
        foodie.posts.forEach(function (onePost) {
            if (req.params.id === onePost.id) {


                onePost.photo = req.body.photo != '' ? req.body.photo : onePost.photo;
                onePost.caption = req.body.caption != '' ? req.body.caption : onePost.caption;
                onePost.restaurantName = req.body.restaurantName != '' ? req.body.restaurantName : onePost.restaurantName;
                onePost.restaurantAddr = req.body.restaurantAddr != '' ? req.body.restaurantAddr : onePost.restaurantAddr;
                onePost.cuisine = req.body.cuisine != '' ? req.body.cuisine : onePost.cuisine;
                onePost.rating = req.body.rating != null ? req.body.rating : onePost.rating;
                foodie.save(function (err) {
                    res.redirect('foodies/profile');


                });
            }
        });
    });
}

function addComment(req, res, next) {

    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost) {
                if (onePost.id === req.params.id) {
                    req.body.username = req.user.username;
                    onePost.comments.push(req.body);
                    console.log('-------------');

                    foodie.save(function (err) {
                        foodie.comments.push(onePost.comments[onePost.comments.length - 1]);
                        foodie.save(function (err) {
                            console.log(foodie.comments);
                            res.redirect(`/foodies/${req.params.id}`);
                        });
                    });
                }
            });
        });
    });
}

function deleteComment(req, res, next) {
    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost) {
                onePost.comments.forEach(function (c, idx) {
                    if (req.params.id === c.id) {
                        onePost.comments.splice(idx, 1);
                        foodie.comments.splice(foodie.comments.indexOf(c), 1);
                        foodie.save(function (err) {
                            console.log(foodie);
                            console.log(onePost);
                            console.log(c);
                            res.redirect(`/foodies/${onePost.id}`);
                        });
                    }
                });
            });
        });
    });
}

function allPostsSearchAndSort(req, res, search, sort) {
    let foundPosts = [];
    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost) {

                if (onePost.restaurantName.match(search) || onePost.cuisine.match(search) || foodie.username.match(search)) {
                    console.log(onePost);
                    foundPosts.push(onePost);
                }
                if (sort === 'rating') {
                    foundPosts.sort((a, b) => b.rating - a.rating);
                } else if (sort === 'comments') {
                    foundPosts.sort((a, b) => b.comments.length - a.comments.length);
                } else if (sort === 'createdAt') {
                    foundPosts.sort((a, b) => b.createdAt - a.createdAt);
                }

            });
        });

        res.render('foodies/index', {
            foodies,
            user: req.user,
            foodInfo: req.query.foodInfo,
            foundPosts
        });
    });
}

function allPostsSortBy(req, res, sort) {
    let foundPosts = [];
    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost) {
                foundPosts.push(onePost);
                if (sort === 'rating') {

                    foundPosts.sort((a, b) => b.rating - a.rating);
                    console.log(foundPosts);
                } else if (sort === 'comments') {
                    foundPosts.sort((a, b) => b.comments.length - a.comments.length);
                } else if (sort === 'createdAt') {
                    foundPosts.sort((a, b) => b.createdAt - a.createdAt);
                }
            });
        });
        console.log(foundPosts + '\n');
        res.render('foodies/index', {
            foodies,
            user: req.user,
            foodInfo: req.query.foodInfo,
            foundPosts
        });
    });

}

function allPostsSearchBy(req, res, search) {
    let foundPosts = [];
    Foodie.find({}, function (err, foodies) {
        foodies.forEach(function (foodie) {
            foodie.posts.forEach(function (onePost, idx) {
                if (onePost.restaurantName.match(search) || onePost.cuisine.match(search) || foodie.username.match(search)) {
                    foundPosts.push(onePost);
                }

            });
        });
        console.log(foundPosts + '\n');
        res.render('foodies/index', {
            foodies,
            user: req.user,
            foodInfo: req.query.foodInfo,
            foundPosts
        });
    });
}