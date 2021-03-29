const express = require('express');
const bodyParser = require('body-parser');
const { PostMessage, LiveMessage } = require('./models/postSchema');
const cron = require('node-cron');

const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
require('./models/connection')();

//converts data to timestamp
function toTimestamp(strDate){ 
    var datum = Date.parse(strDate); 
    return datum/1000;
}

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

   var task = cron.schedule("*/10 * * * * *", () => {
    console.log("cron started");
    PostMessage.find({epochtime:timeStamp})
    .then((response) => {
        response.forEach((responseValue) => {
        delete responseValue._id;
        })
    LiveMessage.insertMany(response)
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

module.exports = router;