const express = require('express')
const app = express()

app.listen(3000 , ()=>{
    console.log("server started at port 3000");
})

const users = [
    {
        id: 111,
        name : "SURESH",
    }
]
app.get('/', function(req, res) {
res.send(users);

})