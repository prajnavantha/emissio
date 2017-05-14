'use strict';

const $ = require("jquery")
const bootstrap = require('bootstrap');
const bs = require('bootstrap/dist/css/bootstrap.css');
const styles = require('./css/app.css')
const React = require('react');
const ReactDOM = require('react-dom');


var utils = require('./shared/utils')

if(! utils.getCookie('accessToken')) {

    require(['./signIn'],function (SingnIn) {
        ReactDOM.render(<SingnIn />, document.getElementById('app'));
    })

} else {
    require(['./mainLayout'],function (Chat) {
        ReactDOM.render(<Chat />, document.getElementById('app'));
    })
}
