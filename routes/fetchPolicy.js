const express = require('express');
const bodyParser = require('body-parser');
const {User, Policy, Agent} = require('../models/userSchema');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', (req, res) =>{
    try{
        let policyDetails = [];
        User.findOne({first_name:req.body.first_name})
            .then((response)=>{
        Policy.findOne({_id:response.policy_id})
            .then((response) => {
                policyDetails.push({'Policy':response});
        Agent.findOne({_id:response.agent_id})
            .then((response) => {
                policyDetails.push({'Agent':response});
                res.status(200).send(policyDetails);
            })
            .catch((error) => {
                console.log('Error fetching agent: '+error);
                res.status(400).send('Error fetching agent');
                })
            })
            .catch((error) => {
                console.log('Error getting policy: '+ error);
                res.status(400).send('Error getting policy');
                })
            })
            .catch(error => console.log('error fetching User: '+ error))
        }
    catch(error)
        {
            res.status(500).send('Internal Server error');
            console.log('Server error: '+error);
        }

    });

router.get('/agent', (req, res) =>{
    try{
        Agent.findOne({agent_name:req.body.agent_name})
            .then((response) => {
        Policy.find({agent_id:response.id})
            .then((response) => {
                res.status(200).send(response);
            })
            .catch((error => {
                console.log('Error fetching Policy(agent): '+ error);
                res.status(400).send('Error fetching Policy');
            }))
        })
            .catch((error) => {
                console.log('Error fetching agent:'+error);
                res.status(400).send('Error fetching agent');
             })
        }
    catch(error)
        {
            res.status(500).send('Internal Server error');
            console.log('Server error: '+error);
        }
    })

module.exports = router;