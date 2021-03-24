
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {postMessage, LivePost} = require('./models/postSchema');
const cron = require('node-cron');

const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const uri = 'mongodb+srv://gopal:S4dDXNKmuoGON1i5@cluster0.zkpt0.mongodb.net/InsuranceDB?retryWrites=true&w=majority'
 mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
        .then(() => {
            console.log('Connection established with MongoDB');
        })
        .catch(error => console.error(error.message));

router.post('/', (req, res) => {

let time = req.body.Time;
let date = req.body.Date;
let message = req.body.Message;

const dateTime = date.concat(' ', time);
const timeStamp = toTimestamp(dateTime);

const myobj= {
    message: message,
    date: date,
    time: time,
    epochtime: timeStamp
};
    
postMessage.create(myobj, function(err, res) {
    if (err) throw err;
    console.log("document inserted");
   });

   var task = cron.schedule("*/1 * * * * *", () =>  {
    console.log('stopped task');
  }, {
    scheduled: false
  });
  
   task.start();

    res.sendStatus(200);
});

function toTimestamp(strDate){ 
    var datum = Date.parse(strDate); 
    return datum/1000;
}
module.exports = router;