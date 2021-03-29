const { connect } = require('mongoose');
//mongodb connection
module.exports = () => { 
const uri = 'mongodb+srv://gopal:S4dDXNKmuoGON1i5@cluster0.zkpt0.mongodb.net/InsuranceDB'
connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then(() => {
            console.log('Connection established with MongoDB');
        })
        .catch(error => console.error(error.message));
}