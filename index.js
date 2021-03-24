
const express = require('express')
var app = express();
const cron = require('node-cron');
//get the count of cpu's the computer has
// const cpuCount = os.cpus().length;
// console.log(cpuCount);

//const workerScript = require('./sorter.js');

//require('./models/connection')();
app.use('/csv-file', require('./routes/uploadFile'));

app.use('/Policy', require('./routes/fetchPolicy'));

app.use('/runcron', require('./cron'));

app.listen(3000, ()=>{
    console.log('listening to server at port 3000');
})


