
const { connect, connection } = require('mongoose');


/*const {___} = require(<package>) is called Destructuring. 
This makes our code a lot more cleaner.
*/

/*We'll use module.exports since we want to import this file in our server.js*/

module.exports = () => { //invoking the dotenv config here
 const uri = 'mongodb+srv://gopal:S4dDXNKmuoGON1i5@cluster0.zkpt0.mongodb.net/InsuranceDB'
 connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true
    })
        .then(() => {
            console.log('Connection established with MongoDB');
        })
        .catch(error => console.error(error.message));
}