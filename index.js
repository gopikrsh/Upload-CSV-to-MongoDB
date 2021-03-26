'use-strict'
const express = require('express')
var app = express();
const cron = require('node-cron');
var osutil = require('node-os-utils')
//get the count of cpu's the computer has
// const cpuCount = os.cpus().length;
// console.log(cpuCount); //check every second for CPU usage
cpuUsageLimit = 70; //restart the node server on 70% usage of the CPU.
//const workerScript = require('./sorter.js');

//require('./models/connection')();
app.use('/csv-file', require('./routes/uploadFile'));

app.use('/Policy', require('./routes/fetchPolicy'));

app.use('/policy/aggregated', require('./routes/aggregatedPolicy'));

app.use('/runcron', require('./cron'));

app.use('/cpu-util', require('./cpuUtilization'));


function serverRestart(){
        var cpu = osutil.cpu
        var count = cpu.count()
        console.log("cpu count", count);
        cpu.usage() 
        .then(cpuPercentage => {
        console.log(cpuPercentage);
        if(cpuPercentage > cpuUsageLimit){
            console.log('High usage limit crossed, restarting the server');
            process.exit();
        }
      })
    }

//setInterval(serverRestart, 1000);

app.listen(3000, ()=>{
    console.log('listening to server at port 3000');
})


