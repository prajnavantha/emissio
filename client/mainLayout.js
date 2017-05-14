'use strict';
const  React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery')

const ChatView = require('./chatUi');
const UsersView = require('./usersView');
const utils = require('./shared/utils');
const socket = require('./shared/socketWrapper');
const components = require('./shared/components');





module.exports = React.createClass({
    getInitialState:function () {

            return {
                userData:"loading"
            }
    },
    componentDidMount:function () {
        socket.subscribe('update users',this.handleUserUpdate);
        this.loadProfileInfo();
    },
    handleUserUpdate:function () {
        this.loadProfileInfo();
    },
    loadProfileInfo: function(){
        var self = this;
            $.get("/users/"+utils.getCookie("accessToken"))
            .done(function(resp){
                self.setState({
                    userData: resp[0]
                })
            })
            .fail(function() {
                components.confirmationBox("alert",{
                    "text":"Could not connect to server",
                    "head":"Alert"
                })
            })
    },
    handleUpdate:function (text) {
        this.loadProfileInfo();
    },
    render:function() {
        var chatUi = "";
        if(this.state.userData === "loading") {
            chatUi = <div className="text-center"> <i className="fa fa-spin fa-spinner"></i> </div>
        } else {
            chatUi = <div className="row full-height">
                <ChatView userInfo = {this.state.userData} />
                <UsersView userInfo = {this.state.userData} onUserUpdate={this.handleUpdate} />
            </div>
        }

        return (
                    <div className="container-fluid full-height">
                        {chatUi}
                    </div>

                )
    }

})
