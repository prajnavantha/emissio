'use strict';

var $ = require("jquery")
var bootstrap = require('bootstrap');
var bs = require('bootstrap/dist/css/bootstrap.css');
var styles = require('./css/app.css')
var React = require('react');
var ReactDOM = require('react-dom');


var utils = require('./shared/utils')
// var Chat = require('./chatView');
// var SingnIn = require('./signIn');

if(! utils.getCookie('accessToken')) {

    require(['./signIn'],function (SingnIn) {
        ReactDOM.render(<SingnIn />, document.getElementById('app'));
    })

} else {
    require(['./mainLayout'],function (Chat) {
        ReactDOM.render(<Chat />, document.getElementById('app'));
    })
}








// ReactDOM.render(<Chat />, document.getElementById('app'));








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
