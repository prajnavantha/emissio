
'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const { HashRouter, Route } = require('react-router-dom');
// var browserHistory = ReactRouter.browserHistory;




const Chat = require('./chatView');
const SingnIn = require('./signIn');

module.exports = () => (
            <HashRouter>
                <div className="appWrapper">
                    <Route exact path='/' component={Chat} />
                    <Route path='/login' component={SingnIn} />
                    <Route path='*' component={SingnIn} />
                </div>
            </HashRouter>

        )
