const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { PostMessage, MoveMessage } = require('./models/postSchema');
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
    
PostMessage.create(myobj, function(err, res) {
    if (err) throw err;
    console.log("document inserted");
   });

   var task = cron.schedule("*/10 * * * * *", () =>  {
    PostMessage.find({epochtime:timeStamp})
    .then((response) => {
        response.forEach((responseValue) => {
            delete responseValue._id;
        })
        MoveMessage.insertMany(response)
        .then((response) => {
            console.log('Transfered the Data from PostMessage: '+response);
        })
        .catch(error => console.log('error while moving data: '+error))
    })
    console.log('stopped task');
  });
  
   task.start();

    res.sendStatus(200);
});

function toTimestamp(strDate){ 
    var datum = Date.parse(strDate); 
    return datum/1000;
}
module.exports = router;