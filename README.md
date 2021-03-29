# Upload-CSV-to-MongoDB

To run the app please follow the below steps.

1. clone the project, cd to the project dir
2. npm install
3. npm start

API functions 

1. API URL : <baseurl>/csv-file
   
   Method : POST 
   
   Request Body Parameter : file
  
  This Endpoint accepts csv file as a parameter, uploads the data in to MongoDB.

2. API URL : <baseurl>/policy
   
   Method : GET
   
   Request Body Parameters : 
   {
       "first_name" : username
   }
  
  This Endpoint accepts first_name as parameter, query the database and returns the policy details of the customer.
   
3. API URL : <baseurl>/policy/agent
   
   Method : GET
   
   Request Body Parameters : 
   {
       "agent_name" : agentname
   }
   
  This Endpoint accepts agent_name as parameter, query the database and returns all the policies mapped by the agent.
  
4.  API URL : <baseurl>/runcron
   
    Method : POST
   
    Request Body Parameters : 
    {
      "Time": time,
      "Date": date,
      "Message": message
    }
   
   This Endpoint accepts time, date and message as parameter, Inserts the message in to a collection on a database and schedule a cron to transfer data from one collection to the  other.
  
 
