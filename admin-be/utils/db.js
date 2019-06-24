// Using Node.js 
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/jumei', {useNewUrlParser: true});

let db=mongoose.connection;
db.on('error',console.error.bind(console,'connection error'));
//暴露这个借口
module.exports = db