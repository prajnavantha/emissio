var http = require('http'),
    express = require('express');


var app = express();
var server = http.createServer(app);
var fs = require('fs');
var path = require('path');
// app.configure(function(){
console.log(__dirname);
// app.use(express.static(__dirname + '/dist'))
app.use('/static', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
// })
var io = require('socket.io').listen(server);

users = [];
connections = [];
server.listen(process.env.PORT || 3000)
console.log('server running...')

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})


io.sockets.on('connection', function(socket) {

    //events here
    //
    connections.push(socket);
    console.log('connected : %s sockets connected', connections.length)


    //Disconnected
    socket.on('disconnect', function(data) {
        //to handle close tab
        // if (!socket.username) {
        //     return;
        // }
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected : %s sockets ', connections.length)
    })
    socket.on('send message', function(data) {
        console.log(data);
        io.sockets.emit('new message', { msg: data,user:socket.username })
    })

    socket.on('new user', function(data, callback) {
        console.log(data);
        callback(true);
        socket.username = data;
        users.push(data);
        updateUserNames();
    })

    function updateUserNames() {
        io.sockets.emit('get users', users);
    }

})
