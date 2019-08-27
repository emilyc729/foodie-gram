var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    name: {
        type: String,
    },
    response: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var postSchema = new Schema({
    photo: {
        type: String,
        data: Buffer,
        contentType: String,
    }, 
    caption: String,
    restaurantName: String,
    restaurantAddr: String,
    cuisine: 
    /*[{type: Schema.Types.ObjectId, ref: 'Cuisine'}],*/
    {
        type: String,
        enum: ['American', 'Asian', 'Mexican', 'Italian', 'Middle Eastern', 'Thai', 'French', 'Japanese', 'Other']
    }, 
    rating: {
        type: Number, 
        min: 0,
        max: 5
    }, 
    comments: [commentSchema]
}, {
    timestamps: true
});

var foodieSchema = new Schema({
    name: String,
    username: String,
    email: String,
    avatar: String,
    googleId: String, 
    posts: [postSchema],
    comments: [commentSchema]
},  {
    timestamps: true
});


module.exports = mongoose.model('Foodie', foodieSchema);