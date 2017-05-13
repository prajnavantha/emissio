var http = require('http'),
    express = require('express');

var bodyParser = require('body-parser'); // for reading POSTed form data into `req.body`
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var expressSession = require('express-session');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise

// var Strategy = require('passport-facebook').Strategy;

var app = express();
var server = http.createServer(app);
var fs = require('fs');
var path = require('path');
app.use('/static', express.static(path.join(__dirname, 'dist')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cookieParser()); // for handling cookie
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

/*Handling Authentication*/
var passport = require('./server/passportAuth');
app.use(passport.initialize());
app.use(passport.session());


/*mongoose connectivity */
var userData = require('./server/models')
mongoose.connect('mongodb://localhost/emissio')


app.get('/users', function(req, res) {
    console.log("here")
    userData
        .find({})
        .then(function(users) {
            res.send(users);
        })
        .catch(function(err) {
            res.status(500).send()
        })
})

app.get('/users/:userId', function(req, res) {
    userData
        .find({_id: req.params.userId })
        .then(function(users) {
            res.send(users);
        })
        .catch(function(err) {
            res.status(500).send()
        })


})

app.post('/users/follow', function(req, res) {
    console.log(req.body)
    var accessToken = req.body.accessToken;

    var followUserData = req.body.userInfo;


    // res.send('eee')
    userData.findOne({
        _id:accessToken
    })
    .then(function(doc,fdfd){
        console.log("updating following data")
        userFollowing = doc.following;
        var data = userFollowing.find(function(item) {
                        return (item._id === followUserData._id);
                })
        if(!data) {
            doc.following.push(followUserData);
        }

        return doc.save()
    })
    .then(function(updatedObject){
        console.log("updating followers data")
        return userData.findOne({
                _id:followUserData._id
            })
            .then(function(doc){
                var followers = doc.followers;
                var data = followers.find(function(item){
                    return (item._id === updatedObject._id)
                })
                if(!data) {
                    doc.followers.push({
                        _id:updatedObject._id,
                        name:updatedObject.name
                    })
                }
                return doc.save()
            })

    })
    .then(function(doc) {
            console.log(doc)
            res.status(200).send()
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).send();
    })


})

app.post('/users/unfollow', function(req, res) {
    console.log(req.body)
    var accessToken = req.body.accessToken;

    var followUserData = req.body.userInfo;

    // res.send('eee')
    userData.findOne({
        _id:accessToken
    })
    .then(function(doc){
        console.log("updating following data")

        userFollowing = doc.following;
        var index = -1;
        var data = userFollowing.find(function(item,ind) {
                        if(item._id === followUserData._id) {
                            index = ind;
                            return true;
                        }
                        return false;
                })


        return userData.update({_id:accessToken},{$pull:{following:{_id:data._id}}})
    })
    .then(function(updatedObject){
        console.log("updating followers data");
        console.log(updatedObject);
        return userData.findOne({
                _id:followUserData._id
            })
            .then(function(doc){
                var followers = doc.followers;
                var data = followers.find(function(item){
                    return (item._id === updatedObject._id)
                })
                if(data) {
                    doc.followers.pull({
                        _id:updatedObject._id
                    })
                }
                return userData.update({_id:followUserData._id},{$pull:{followers:{_id:accessToken}}})
            })

    })
    .then(function(doc) {
            res.status(200).send()
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).send();
    })


})



app.get('/login/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
        res.cookie('accessToken', req.user.id);
        var user = req.user;
        var data = new userData();
        data.name = user.displayName;
        data.email = user.emails[0]['value'];
        data.photo = user.photos[0]['value'];
        data._id = user.id;
        userData
        .findOne({ _id: user.id })
        .then(function(doc) {
                if (!doc) {
                    data.save();
                    createSocketConnection(data._id)
                }

        })
        .catch(function(err){
            console.log(err);
            res.status(500).send()
        })
        res.redirect('/');




    });


app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})






var io = require('socket.io').listen(server);

users = [];
connections = [];
server.listen(process.env.PORT || 3000)
console.log('server running...')


userData.find(function(err, doc) {
    // console.log(doc)
    doc.forEach(function(item) {
        createSocketConnection(item["id"])
    })
})

function createSocketConnection(id) {
    io
        .of(id)
        .on('connection', function(id) {

            return function (socket) {
                socket.on('send message', function(data) {
                    console.log('msg is', data)
                    //find all the followers and emit to them in for loop
                    console.log(id);
                    userData.findOne({
                        _id:id
                    })
                    .then(function(doc){
                        console.log(doc);
                        var followers = doc.followers;
                        console.log(followers);
                        socket.emit('new message', { msg: data, user: {name:doc.name,_id:doc._id} })
                        followers.forEach(function (item) {
                            console.log(item);
                            io.of(item._id).emit('new message', { msg: data, user: {name:doc.name,_id:item._id} })
                            // io.of('10203135515704253').emit('new message', { msg: data, user: socket.username })
                        })
                    })

                })
            }

        }(id))
}




// io.of('10203135515704253')
//     .on('connection', function(socket) {
//         console.log('inddddddddddddd')
//         socket.on('send message', function(data) {
//             console.log("bahhhhhhhhhh", data)
//             socket.emit('new message', { msg: data, user: socket.username })
//         })
//     })
//
// io.sockets.on('connection', function(socket) {
//
//     //events here
//     //
//     connections.push(socket);
//     console.log('connected : %s sockets connected', connections.length)
//
//
//     //Disconnected
//     socket.on('disconnect', function(data) {
//         //to handle close tab
//         // if (!socket.username) {
//         //     return;
//         // }
//         users.splice(users.indexOf(socket.username), 1);
//         updateUserNames();
//
//         connections.splice(connections.indexOf(socket), 1);
//         console.log('Disconnected : %s sockets ', connections.length)
//     })
//
//     // socket.of("10203135515704253").on("send message",function (data) {
//     //     console.log("this is ddata",data);
//     // })
//     socket.on('send message', function(data) {
//         console.log(data);
//         //get all followers and emit to them
//         io.of('10203135515704253').emit('new message', { msg: data, user: socket.username })
//     })
//
//     //shoudl be done on new user login attempt
//     // socket.on('new user', function(data, callback) {
//     //     console.log(data);
//     //     callback(true);
//     //     socket.username = data;
//     //     users.push(data);
//     //     updateUserNames();
//     // })
//
//     function updateUserNames() {
//         io.sockets.emit('get users', users);
//     }
//
// })
