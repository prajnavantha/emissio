'use strict';

var $ = require("jquery")
var bootstrap = require('bootstrap');
var io = require('socket.io-client')
var bs = require('bootstrap/dist/css/bootstrap.css');

var  React = require('react');
var ReactDOM = require('react-dom');

var Chat = require('./chat');

ReactDOM.render(<Chat />, document.getElementById('app'));








// $(function() {
//     React.renderComponent(<h1>Hello, world!</h1>, document.getElementById('userArea'))
//
//     var socket = io.connect();
//     var $msgForm = $("#messageForm")
//     var $msg = $("#message")
//     var $chat = $("#chat")
//
//     var $userFormArea = $("#userArea");
//     var $userForm = $("#userForm");
//     var $msgArea = $("#msgArea");
//     var $username = $("#username");
//     var $users = $("#users");
//
//
//     $userForm.submit(function(e) {
//         e.preventDefault();
//
//         socket.emit('new user', $username.val(), function(data) {
//             if (data) {
//                 $userFormArea.hide();
//                 $msgArea.show();
//             }
//         });
//
//     })
//
//     $msgForm.submit(function(e) {
//         e.preventDefault();
//         socket.emit('send message', $msg.val());
//         $msg.val('');
//     })
//
//     socket.on('new message', function(data) {
//         $chat.append('<div class="well"> <strong>' + data['user'] + ' : </strong>' + data['msg'] + '</div>')
//     })
//
//     socket.on('get users', function(data) {
//         var html = '';
//         for (var i = 0; i < data.length; i++) {
//             html += '<li class="list-group-item">' + data[i] + '</li>'
//         }
//         $users.html(html);
//     })
//
//
// })