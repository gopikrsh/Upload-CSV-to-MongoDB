const { Worker } = require('worker_threads')
const os = require('os')

const express = require('express')
const router = express.Router()
const multer = require('multer')
const csv = require('fast-csv')
const fs = require('fs')
const upload = multer({dest: 'temp/csv/' });

var app = express();
//get the count of cpu's the computer has
// const cpuCount = os.cpus().length;
// console.log(cpuCount);

//const workerScript = require('./sorter.js');


app.use('/csv-file', require('./routes/uploadFile'));

app.listen(3000, ()=>{
    console.log('listening to server at port 3000');
})


