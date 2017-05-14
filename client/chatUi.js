'use strict'
const  React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

const socket = require('./shared/socketWrapper');
const components = require('./shared/components');


const UserHeader = React.createClass({

    render:function(){

        return (
            <div className="app-color-secondary" style={{padding:'10px'}}>
                <div className="flexDisplay flex-justify-space-between flex-align-center">
                <div>
                    <div className="flexDisplay flex-align-center">
                        <div >
                            <img src={this.props.userInfo.photo} alt="User Avatar" class="img-circle" style={{border:' 2px solid #055A09',borderRadius:'50%'}} />
                        </div>
                        <div style={{margin:'0 10px'}}>
                            <div>{this.props.userInfo.name}</div>
                            <small className="app-color-lightgrey-text">You have {this.props.userInfo.followers.length} followers</small>
                            </div>
                        </div>
                    </div>


                    <div>
                        <a onClick={this.props.onLogOut} style={{padding:'10px',cursor:'pointer'}}>
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

            var objDiv = document.getElementById("chatArea"); //not an elegant way but works
            objDiv.scrollTop = objDiv.scrollHeight;
    },
    render:function () {
        var self = this;
        var msgStream = this.state.msgs.map(function (item,ind) {
            return <ChatStream msg={item} key={ind} userId={self.props.userId} />
        })

        return (

            <div id="chatArea" className="app-color-dark-grey" style={{height:'80%',overflowY:'scroll'}}>
                <div className="container-fluid">
                    {msgStream}
                </div>
            </div>


        )
    }
})

const ChatStream = React.createClass({

    render:function () {
        var chatClass = "row"
        var userInfo = <h4 className="media-heading">{this.props.msg['user']['name']}</h4>
        var chatStyle = {padding:'20px',borderRadius:'0px 20px 0px 20px'}
        var chatBlockColor = "app-color-white";
        if(this.props.msg['user']['_id'] === this.props.userId) {
            //present user
            userInfo = "";
            chatClass += " pull-right";
            chatStyle = {padding:'20px',borderRadius:'20px 0px 20px 0px'}
            chatBlockColor += " app-color-primary"
        }

        var chatBlockClass = "media-body "+ chatBlockColor;
        return (
            <div className={chatClass} style={{padding:'10px 5px',width:'70%'}}>
                <div className="col-lg-12">
                    <div className="media">

                        <div className={chatBlockClass} style={chatStyle}>
                            {userInfo}
                            <p>{this.props.msg['msg']}</p>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
})

module.exports = React.createClass({

    handleLogOut:function(){
            $.get("/logout")
            .done(function(){
                location.reload();
            })
            .fail(function (err) {
                components.confirmationBox("alert",{
                    "text":"Could not connect to server",
                    "head":"Alert"
                })
            })
    },
    handleSend:function (val) {
        socket.emit('send message',val);
    },

    render:function () {
        return (
            <div className="col-md-8 full-height emissio-chatView-main flexDisplay flex-direction-column">
                <UserHeader userInfo={this.props.userInfo} onLogOut={this.handleLogOut} />
                <div className="flex-full relativePosition ">
                    <div className="full-container-layout flex-direction-column flexDisplay ">
                        <ChatMsg userId={this.props.userInfo._id} />
                        <div className="flex-full app-color-secondary" >
                                <ChatInput onSend={this.handleSend} />
                        </div>
                    </div>


                </div>
            </div>
    )
    }
})
