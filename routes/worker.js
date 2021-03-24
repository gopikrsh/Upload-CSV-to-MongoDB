 'use-strict'
 const { parentPort, workerData, isMainThread } = require("worker_threads");
 const {User, User_account, Policy, Agent} = require('../models/userSchema');
 const mongoose = require('mongoose');
 const db = mongoose.connection;
 

 const uri = 'mongodb+srv://gopal:S4dDXNKmuoGON1i5@cluster0.zkpt0.mongodb.net/InsuranceDB?retryWrites=true&w=majority'
 mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
        .then(() => {
            console.log('Connection established with MongoDB');
        })
        .catch(error => console.error(error.message));


       function run(workerData) {
          try {
            // create an array of documents to insert
            const docs = workerData;
            // this option prevents additional documents from being inserted if one fails
          docs.map(data =>{
            Agent.findOneAndUpdate({agent_name:data.agent},
              {
                agent_name : data.agent,
                producer: data.producer
              },{new: true, upsert : true})
              .then((response) => {
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
                  .then((response)=>{
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
                      },
                      {new: true, upsert:true})
                      .then((response)=>{
                        User_account.findOneAndUpdate({account_name: data.account_name},
                          {
                              account_name: data.account_name,
                              account_type: data.account_type,
                              user_policy_id: response.id
                          },
                          {new: true, upsert:true})
                        .catch(error => console.log('error updating user account: '+ error))

                      })
                      .catch(error => console.log('error updating user: '+error))

                  })
                  .catch(error => console.log('error updatin policy: '+error))

              })
              .catch(error => console.log('error updating agent'+ error));

            }) 
          }
        catch(err){
          console.log(err)
        }
      }
      parentPort.postMessage(run(workerData));