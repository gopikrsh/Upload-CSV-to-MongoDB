'use-strict'
const express = require('express');
const router = express();
const process = require('process');  

var osutil = require('node-os-utils')

CHECK_CPU_USAGE_INTERVAL = 1000; //check every second for CPU usage
HIGH_CPU_USAGE_LIMIT = 70; 

router.get('/restart', function (req, res, next) {

  var cpu = osutil.cpu
  var count = cpu.count()
  console.log("cpu count", count);
  cpu.usage() 
  .then(cpuPercentage => {
    console.log(cpuPercentage);
      if(cpuPercentage > HIGH_CPU_USAGE_LIMIT){
        console.log('High usage limit crossed, restarting the server');
          process.exit();
      }
  
      }, CHECK_CPU_USAGE_INTERVAL); 
  });

module.exports = router;

//   autoRestart = setInterval(function(){
//     usage(process.pid, function(err, result){
//         if(!err)
//         {
//             if(result.cpu > HIGH_CPU_USAGE_LIMITE)
//             {
//                 console.log('restarting the server due to high useage of CPU');
//                  // restart because forever will respawn your process
//                 process.exit();
//             }
//         }
//     })
// }, CHECK_CPU_USAGE_INTERVAL);

//start = setInterval(function(){
//     usage.lookup(process.pid, function(err, result){
//         if(!err)
//         {
//             if(result.cpu > HIGH_CPU_USAGE_LIMIT)
//             {
//                 console.log('restarting the server due to high useage of CPU');
//                  // restart because forever will respawn your process
//                 process.exit();
//             }
//         }
//     })
// }, CHECK_CPU_USAGE_INTERVAL);
