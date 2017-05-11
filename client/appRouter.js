
'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var { HashRouter, Route } = require('react-router-dom');
// var browserHistory = ReactRouter.browserHistory;




var Chat = require('./chatView');
var SingnIn = require('./signIn');

module.exports = () => (
            <HashRouter>
                <div className="appWrapper">
                    <Route exact path='/' component={Chat} />
                    <Route path='/login' component={SingnIn} />
                </div>
            </HashRouter>

        )
