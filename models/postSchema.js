const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    message: String,
    date: String,
    time: String,
    epochtime:Number
});

const LiveSchema = new Schema({
    message: String,
    date:String,
    time:String
});

const postMessage = mongoose.model('postMessage', PostSchema);
const LivePost = mongoose.model('LivePost', LiveSchema);

module.exports = {postMessage, LivePost};