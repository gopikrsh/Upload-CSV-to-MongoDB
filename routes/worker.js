 const { parentPort, workerData, isMainThread } = require("worker_threads");
const fs = require('fs');


function readFile(bigArray){
  try {
    const data = bigArray[0];
    return data;
  } catch (err) {
    console.error(err)
  }
}



// check that the sorter was called as a worker thread
if (!isMainThread) {
    console.log("keep going");
    
  //make sure we got an array of data
  if (!Array.isArray(workerData)) {
    // we can throw an error to emit the "error" event from the worker
    throw new Error("workerData must be an array of numbers");
  }
  //we post a message through the parent port, to emit the "message" event
  parentPort.postMessage(workerData);
}


