
const express = require('express')
var app = express();
//get the count of cpu's the computer has
// const cpuCount = os.cpus().length;
// console.log(cpuCount);

//const workerScript = require('./sorter.js');

//require('./models/connection')();
app.use('/csv-file', require('./routes/uploadFile'));

app.listen(3000, ()=>{
    console.log('listening to server at port 3000');
})


