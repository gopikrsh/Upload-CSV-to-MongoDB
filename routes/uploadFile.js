'use-strict'
 const express = require('express');
 const bodyParser = require('body-parser');
 const multer = require('multer')
 const upload = multer({dest: 'temp/csv/' });
 const CsvSplitter = require('csv-splitter');
 const fs = require('fs');
 
 const util = require('util');
 const readdir = util.promisify(fs.readdir);
 const unlink = util.promisify(fs.unlink);
 const path = require("path");
 
 const router = express();
 router.use(bodyParser.urlencoded({ extended: true }));
 router.use(bodyParser.json());
 const workerScript = path.join(__dirname, "./worker.js");

 const Pool = require("worker-threads-pool");
 const pool = new Pool({ max: 100 });

 const currDir = path.join(__dirname + '/../temp/csv/splittedFiles/');

 //pool of workers
 const uploadFileWithWorker = file => {
  return new Promise((resolve, reject) => {
    pool.acquire(workerScript, { workerData: file }, (err, worker) => {
    if (err) {
      return reject(err);
    }
    worker.once('message', resolve);
    worker.once("error", reject);
      });
    });
  };

//function to delete all files in the directory
async function deleteSplitterFiles(currDir) {
  try {
    const files = await readdir(currDir);
    const unlinkPromises = files.map(filename => unlink(`${currDir}/${filename}`));
    return Promise.all(unlinkPromises);
  } catch(err) {
    console.log(err);
  }
}

//split csv and distribute to workers
async function distributeLoadAcrossWorkers(csvfile) {
  
  CsvSplitter.split(csvfile, 100, __dirname + '/../temp/csv/splittedFiles/');
    const files = await readdir(currDir);
    const promises = files.map(filename => {
    let currFilePath = currDir + filename;
    return uploadFileWithWorker(currFilePath);
  })
    return Promise.all(promises);
}

router.post('/', upload.single('file'), async function (req, res) {
  try{
    if(!req.file)
    return res.status(400).send('No files were uploaded.');
    const csvfile = req.file.path;
    await deleteSplitterFiles(currDir);
    const result = await distributeLoadAcrossWorkers(csvfile); 
    res.send(result[0]);
  } catch(err) {
    res.send(err);
    }
  })

module.exports = router;