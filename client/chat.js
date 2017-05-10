'use strict';
var  React = require('react');
var ReactDOM = require('react-dom');


module.exports = React.createClass({


    render:function(){
        return (
            <div className="container full-height">
                <div className="row full-height">
                    <div className="col-md-8 full-height">Left</div>
                    <div className="col-md-4 full-height">Right</div>

                </div>
            </div>

        )

    }
})
