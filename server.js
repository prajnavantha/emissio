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


var mongoose = require('./server/mongooseConnection');

var userData = require('./server/userModel')(mongoose);

app.get('/users', function(req, res) {
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

app.get('/logout', function(req, res){
    res.clearCookie('accessToken');
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
})

app.post('/users/follow', function(req, res) {
    var accessToken = req.body.accessToken;

    var followUserData = req.body.userInfo;


    // res.send('eee')
    userData.findOne({
        _id:accessToken
    })
    .then(function(doc){
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
            broadCastAll("update users");
            res.status(200).send()
    })
    .catch(function (err) {
        console.log(err);
        res.status(500).send();
    })


})

app.post('/users/unfollow', function(req, res) {
    var accessToken = req.body.accessToken;

    var followUserData = req.body.userInfo;

    // res.send('eee')
    userData.findOne({
        _id:accessToken
    })
    .then(function(doc){
        console.log("updating unfollowing data")

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
            broadCastAll("update users");
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
                    data
                    .save()
                    .then(function(){
                        createSocketConnection(data._id);
                        broadCastAll("new user",data);
                    })


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
function broadCastAll(type,msg) {
    Object.keys(io.nsps).forEach(function (id) {
        // io.of(id).emit(type,msg);
        socketEmit(id,type,msg);
    })
}
function socketEmit(id,type,msg) {
    io.of(id).emit(type,msg)
}

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
                    userData.findOne({
                        _id:id
                    })
                    .then(function(doc){
                        var followers = doc.followers;
                        var emitMsg = { msg: data, user: {name:doc.name,_id:doc._id} }
                        socketEmit(id,'new message',emitMsg);

                        followers.forEach(function (item) {
                            socketEmit(item._id,'new message',emitMsg);

                        })
                    })

                })
            }

        }(id))
}
