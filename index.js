'use-strict'
const express = require('express');
var app = express();
var osutil = require('node-os-utils');

cpuUsageLimit = 70; //restart the node server on 70% usage of the CPU.

//API to fetch details from csv file and upload it to mongodb
app.use('/csv-file', require('./routes/uploadFile'));

//API to fetch policy details from mongodb
app.use('/Policy', require('./routes/fetchPolicy'));

//API to schedule cron jobs
app.use('/runcron', require('./cron'));

//function to restart the server based on cpu utilization
function serverRestart() {

    var cpu = osutil.cpu
    var count = cpu.count()
        console.log("cpu count", count);
    cpu.usage() 
    .then(cpuPercentage => {
        console.log(cpuPercentage);

    if(cpuPercentage > cpuUsageLimit) {
        console.log('High usage limit crossed, restarting the server');
        process.exit();
       }
    })
}

setInterval(serverRestart, 1000);

//connecting to server
app.listen(3000, ()=>{
    console.log('listening to server at port 3000');
})


