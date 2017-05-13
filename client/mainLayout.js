'use strict';
var  React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery')

const ChatView = require('./chatUi');
const UsersView = require('./usersView');
const utils = require('./shared/utils');






module.exports = React.createClass({
    getInitialState:function () {

            return {
                userData:"loading"
            }
    },
    componentDidMount:function () {
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
