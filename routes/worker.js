 'use-strict'
 const { parentPort, workerData } = require("worker_threads");
 const { User, User_account, Policy, Agent, Category, Carrier } = require('../models/userSchema');
 const mongoose = require('mongoose');
 const csv = require('csv-parser');
 const fs = require('fs');
 require('../models/connection')();
 
const db = mongoose.connection;
try{
    db.once('open', function(){
      // Reading the csv file
    fs.createReadStream(workerData)
    .pipe(csv({}))
    .on('data', (data) => {
        //Inserting agent details
        Agent.findOneAndUpdate({agent_name:data.agent},
            {
                agent_name: data.agent,
                producer: data.producer
            },  {new: true, upsert:true})
                .then((response) => {
                  //inserting policy details
        Policy.findOneAndUpdate({policy_number:data.policy_number},
            {
                premium_amount: data.premium_amount,
                premium_amount_written: data.premium_amount_written,
                policy_start_date: data.policy_start_date,
                policy_end_date: data.policy_end_date,
                category_name: data.category_name,
                company_name: data.company_name,
                policy_number: data.policy_number,
                policy_mode: data.policy_mode,
                policy_type: data.policy_type,
                agent_id: response.id
            }, {new: true, upsert:true})
                .then((response) => {
                //inserting user details
        User.findOneAndUpdate({email:data.email},
            {
                email: data.email,
                first_name: data.firstname,
                gender: data.gender,
                city: data.city,
                phone: data.phone,
                address: data.address,
                state: data.state,
                zip: data.zip,
                dob: data.dob,
                policy_id: response.id
            },  {new: true, upsert:true})
                .then((response) => {
                //Inserting user_account details
        User_account.findOneAndUpdate({account_name: data.account_name},
            {
                account_name: data.account_name,
                account_type: data.account_type,
                user_policy_id: response.id
            },  {new: true, upsert:true})
                .then((response)=>{
                //Inserting carrier details;
        Category.findOneAndUpdate({category_name: data.category_name},
            {
                category_name: data.category_name,
                user_account_id: response.id
            },  {new: true, upsert:true})
                .then((response)=>{
                //Inserting carrier details
        Carrier.findOneAndUpdate({company_name: data.company_name},
            {
                company_name: data.company_name,
                user_account_id: response.id
            },  {new: true, upsert:true})
                
                .catch(error => console.log('error updating carrier: '+ error))
            })
                .catch(error => console.log('error updating category: '+ error))
            })
                .catch(error => console.log('error updating user account: '+ error))
            })
                .catch(error => console.log('error updating user: '+error))
            })
                .catch(error => console.log('error updating policy: '+error))
            })
                .catch(error => console.log('error updating agent'+ error));
            })
                .on('end', () => {
                const message = {
                    Msg : "Successfully uploaded csv file in to mongodb",
                    Status : "OK"
            }
                parentPort.postMessage(message);
          })
        });
    }
    catch(err){
        console.log('error in worker thread: ' + err);
    }