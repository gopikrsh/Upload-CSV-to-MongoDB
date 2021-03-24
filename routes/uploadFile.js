'use-strict'
 const express = require('express');
 const router = express.Router();
 const multer = require('multer')
 const csvtojson = require("csvtojson");
 const upload = multer({dest: 'temp/csv/' });

 const os = require("os");
 const cpuCount = os.cpus().length;
 const path = require("path");

 const workerScript = path.join(__dirname, "./worker.js");
 const Pool = require("worker-threads-pool");
 const pool = new Pool({ max: cpuCount });

const sortArrayWithWorker = arr => {
return new Promise((resolve, reject) => {
  pool.acquire(workerScript, { workerData: arr }, (err, worker) => {
    if (err) {
      return reject(err);
    }
    worker.once("message", resolve);
    worker.once("error", reject);
    });
  });
};

async function run(csvData) {
  const count = Object. keys(csvData). length;
  
    //sort with a single worker
    const start = Date.now();
    const result1 = await distributeLoadAcrossWorkers(1, count, csvData);
    console.log(
      `sorted ${result1} items, with 1 worker in ${Date.now() - start}ms`
    );
  
    // sort with multiple workers, based on the cpu count
    // const start3 = Date.now();
    // const result3 = await distributeLoadAcrossWorkers(cpuCount, count, csvData);
    // console.log(
    //   `sorted ${result3} items, with ${cpuCount} workers in ${Date.now() - start3}ms`
    // );
    // console.log("\n done");
  }

async function distributeLoadAcrossWorkers(workers, filecount, csvfile){
  const segmentsPerWorker = Math.round( filecount/workers);
  const promises = Array(workers)
  .fill()
  .map((_, index) => {
    let arrayToSort;
    if (index === 0) {
      // the first segment
      arrayToSort = csvfile.slice(0, segmentsPerWorker);
    } else if (index === workers - 1) {
      // the last segment
      arrayToSort = csvfile.slice(segmentsPerWorker * index);
    } else {
      // intermediate segments
      arrayToSort = csvfile.slice(segmentsPerWorker * index,segmentsPerWorker * (index + 1))
    }
   sortArrayWithWorker(arrayToSort)
  });
  
 await Promise.all(promises);

 }

router.post('/', upload.single('file'), function (req, res) {
  const csvfile = req.file.path;
  csvtojson()
  .fromFile(csvfile)
  .then(csvData => {
    run (csvData);
  })
  res.send("file successfully uploaded");
})

module.exports = router;