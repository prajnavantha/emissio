var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect('mongodb://'+ config.dbHost +'/emissio');

var connection = mongoose.connection;

connection.on("connect",function(){
    console.log("connected to db");
})

connection.on("disconnected",function(){
    console.log("disconnected to db");
})

connection.on("error",function(){
    console.log("db connection error");
})

process.on('SIGINT',function(){
    connection.close(function(){
        console.log("db connection closed due to process termination")
        process.exit(0);
    })
})

module.exports = mongoose;
