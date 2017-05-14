'use strict'
const React = require('react');
const ReactDOM = require('react-dom');
const utils = require('./shared/utils');
const $ = require('jquery');
const socket = require('./shared/socketWrapper');
const components = require('./shared/components');


const UserHeader = React.createClass({
    getInitialState:function () {
            return {
                isConnected:true
            }
    },
    componentDidMount:function () {
        socket.subscribe('disconnect',this.handleDisconnection);
        socket.subscribe('connect',this.handleConnection);

    },
    handleConnection:function () {
        this.setState({
            isConnected:true
        })
    },
    handleDisconnection:function () {
        this.setState({
            isConnected:false
        })
    },

    render:function(){
        var headerClass = "app-color-dark";
        var text = "Users"
        if(!this.state.isConnected) {
            headerClass = "app-color-warning";
            text = "Disconnected from Server"
        }
        headerClass += " app-color-text--white"
        return (
            <div className={headerClass} style={{padding:'10px'}}>
                <div className="flexDisplay flex-justify-space-between flex-align-center">
                    <div><h5>{text}</h5></div>
                    <div>

                    </div>
                </div>

            </div>


        )
    }
})

const UserView = React.createClass( {
    isFollowing:false,
    handleFollow: function () {
        this.props.onFollow(this.props.user,this.isFollowing);
    },
    render:function () {
        var followText = "Follow";
        var self = this;
        var user = this.props.following.find(function (item) {
            return (item._id === self.props.user._id)
        })
        this.isFollowing = false;
        if(user) {
            this.isFollowing = true
            followText = "Unfollow";
        }
        return ( <li>
                    <span className="chat-img pull-left">
                                <img src={this.props.user.photo} alt="User Avatar" className="img-circle" />
                    </span>
                    <div className="chat-body clearfix">
                                    <div className="flexDisplay flex-justify-space-between ">
                                        <div>
                                            <strong className="app-color-text--white">{this.props.user.name}</strong>
                                            <br/>
                                            <small style={{color:'#ccc'}}>{(this.isFollowing)?"Following":""}</small>
                                        </div>
                                        <button onClick={this.handleFollow} style={{height:'35px'}} className="btn btn-info btn-sm">{followText}</button>

                                    </div>
                    </div>
                </li>)
    }

})

module.exports = React.createClass({
    getInitialState:function () {
            return {
                users:""
            }
    },
    componentDidMount:function() {
        this.loadUsers();
        socket.subscribe('new user',this.handleNewUser)

    },
    handleNewUser: function (data) {
        var users = this.state.users;
        users.push(data);
        this.setState({
            users:users
        })
    },
    loadUsers: function () {
        var self = this;
            $.get("/users")
            .done(function (resp) {
                var response = resp;
                self.setState({
                    users:response
                })

            })
            .fail(function() {
                components.confirmationBox("alert",{
                    "text":"Could not connect to server",
                    "head":"Alert"
                })
            })
    },
    handleFollow: function (user,isFollowing) {
        var self = this;
        var url = "/users/";
        if(isFollowing) {
            url += "unfollow";
        } else {
            url += "follow";
        }
        var data = {
            accessToken: utils.getCookie("accessToken"),
            userInfo:{
                _id:user._id,
                name:user.name
            }
        }
        $.post(url,data)
        .then(function (resp) {
            self.props.onUserUpdate();
        })
        .fail(function() {
            components.confirmationBox("alert",{
                "text":"Could not connect to server",
                "head":"Alert"
            })
        })
    },

    render:function () {
        var layout = "";
        var self = this;
        if(!this.state.users) {
            layout = <div className="text-center"><i className="fa fa-spin fa-spinner"></i></div>
        } else {

            var usersFilter = this.state.users.filter(function(map){

            })

            layout = <div style={{height:'100%',overflowY:'auto'}}>
                        <ul className="usersListView">
                         {
                             this.state.users.sort(function(a,b){
                                 var foundA = 1;
                                 var foundB = 1;
                                 self.props.userInfo.following.find(function(item){
                                     if(item._id === a._id) {
                                         foundA = -1;
                                         return true;
                                     } else if(item._id === b._id) {
                                         foundB = -1;
                                         return true;
                                     }
                                     return false;
                                 })

                                     if(foundA === -1) {
                                         return -1;
                                     }
                                     if(foundB === -1) {
                                         return 1;
                                     }
                                     return 0;

                             })
                             .filter(function(item){
                                 return (self.props.userInfo._id !== item._id)
                             })
                            .map(function (item,ind) {
                                return <UserView key={ind} user={item} following={self.props.userInfo.following} onFollow={self.handleFollow}/>
                            })
                        }
                        </ul>
                    </div>
        }
        return (
            <div className="col-md-4 full-height emissio-userView-main flexDisplay flex-direction-column" >
                <UserHeader />
                <div className="flex-full relativePosition flex-direction-column app-color-dark">
                    <div className="full-container-layout">

                            {layout}

                    </div>
                </div>
            </div>
        )
    }
})
