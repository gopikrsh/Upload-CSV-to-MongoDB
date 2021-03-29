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

const PostMessage = mongoose.model('PostMessage', PostSchema);
const LiveMessage = mongoose.model('LiveMessage', LiveSchema);

module.exports = {PostMessage, LiveMessage};