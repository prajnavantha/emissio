'use strict'
var  React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');

var socket = require('./shared/socketWrapper');


const UserHeader = React.createClass({

    render:function(){

        return (
            <div className="app-color-primary app-color-text--white" style={{padding:'10px'}}>
                <div className="flexDisplay flex-justify-space-between flex-align-center">
                    <div><h5>{this.props.text}</h5></div>
                    <div>
                        <a className="app-color-text--white" style={{padding:'10px',cursor:'pointer'}}>
                            <i className="fa fa-2x fa-sign-out " aria-hidden="true"></i>
                        </a>
                    </div>
                </div>

            </div>


        )
    }
})


const ChatInput = React.createClass({
    getInitialState:function () {
        return {
            text:""
        }
    },
    handleInput: function (e) {
        var val = $(e.target).val();
        this.setState({
            text: val
        })
    },
    handleSend: function (e) {
        var val = $(this.ip).val();
        this.props.onSend(val);
        this.setState({
            text:""
        })
    },
    handleKeyPress: function(e) {
        if (e.key === 'Enter') {
          this.handleSend(e);
        }
    },
    setRef: function (e) {
        this.ip = e;
    },
    render:function() {
        var len = this.state.text.length;
        var text = len+"/140";
        return (
            <div style={{padding:'20px'}}>
                <p style={{fontSize:'12px',color:'#535353'}}>
                    {text}
                </p>
                <div className="input-group">
                           <input ref={this.setRef} value={this.state.text} onKeyPress={this.handleKeyPress} maxLength={140} type="text" onInput={this.handleInput} className="form-control input-lg" placeholder="Type your message here..." />
                           <span className="input-group-btn">
                               <button className="btn btn-warning btn-lg" onClick={this.handleSend} >Send</button>
                           </span>
                </div>
            </div>
        )
    }
})


const ChatMsg = React.createClass({
    getInitialState:function () {
            return {
                msgs:[]
            }
    },
    componentDidMount:function () {
            socket.subscribe('new message',this.handleMessage)
    },
    handleMessage:function (data) {
            var msg = this.state.msgs;
            msg.push(data);
            this.setState({
                msgs:msg
            })
    },
    render:function () {
        var msgStream = this.state.msgs.map(function (item,ind) {
            return <ChatStream msg={item} key={ind} />
        })

        return (

            <div style={{height:'80%'}}>
                {msgStream}
            </div>


        )
    }
})

const ChatStream = React.createClass({

    render:function () {
        return (
            <div>
            <strong>{this.props.msg['user']['name']}</strong>
            {this.props.msg['msg']}
            </div>



        )
    }
})

module.exports = React.createClass({


    handleSend:function (val) {
        socket.emit('send message',val);
    },

    render:function () {
        return (
            <div className="col-md-8 full-height emissio-chatView-main flexDisplay flex-direction-column">
                <UserHeader text={this.props.userInfo.name} />
                <div className="flex-full relativePosition ">
                    <div className="full-container-layout flex-direction-column flexDisplay ">
                        <ChatMsg />
                        <div className="flex-full app-color-lightgrey" >
                                <ChatInput onSend={this.handleSend} />
                        </div>
                    </div>


                </div>
            </div>
    )
    }
})
