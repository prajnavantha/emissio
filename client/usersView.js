'use strict'
var React = require('react');
var ReactDOM = require('react-dom');
var utils = require('./shared/utils');
var $ = require('jquery');

const UserHeader = React.createClass({


    render:function(){

        return (
            <div className="app-color-text--white app-color-dark" style={{padding:'10px'}}>
                <div className="flexDisplay flex-justify-space-between flex-align-center">
                    <div><h5>{this.props.text}</h5></div>
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
        var followText = "follow";
        var self = this;
        var user = this.props.following.find(function (item) {
            return (item._id === self.props.user._id)
        })
        if(user) {
            this.isFollowing = true
            followText = "unfollow";
        }
        return ( <li className="left clearfix"><span className="chat-img pull-left">
                                <img src={this.props.user.photo} alt="User Avatar" className="img-circle" />
                            </span>
                                <div className="chat-body clearfix">
                                    <div className="header">
                                        <strong className="app-color-text--white">{this.props.user.name}</strong>
                                        <small className="pull-right text-muted">
                                            <button onClick={this.handleFollow} className="btn btn-default btn-sm">{followText}</button>
                                        </small>
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
    },
    handleFollow: function (user,isFollowing) {
        console.log(user);
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
            console.log("reloading users data")
            self.props.onUserUpdate();
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

            layout = <div style={{height:'100%'}}>
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
                <UserHeader text={"Users"} />
                <div className="flex-full relativePosition flex-direction-column app-color-dark">
                    <div className="full-container-layout">

                            {layout}

                    </div>
                </div>
            </div>
        )
    }
})
