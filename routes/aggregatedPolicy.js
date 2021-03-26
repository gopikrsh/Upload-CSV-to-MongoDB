const express = require('express')
const bodyParser = require('body-parser');
const router = express();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res)=>{

    const obj = req.body.Name;
    console.log(obj);
    res.sendStatus(200);
})

module.exports = router;