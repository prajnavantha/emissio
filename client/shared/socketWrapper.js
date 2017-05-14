'use strict'

var io = require('socket.io-client');
var utils = require('../shared/utils');
var socket = io.connect(location.protocol + "//" + window.location.host + '/' + utils.getCookie("accessToken"));



var socketHandler = function() {
    // body...

    this.subscribeList = {};
    this.uniqueIndex = {}; // just in case if subscriptions happens uniquely
    this.socket = ""
    this.loadSocketIO()

}

socketHandler.prototype.loadSocketIO = function() {
    var self = this;
    self.socket = io(location.protocol + "//" + window.location.host+"/" + utils.getCookie("accessToken"));
    // self.createSocketConnection();
    self.socket.io.reconnectionAttempts(20)

    self.socket.on("connect", function() {
        window.isOnline = true;
        self.handleConnected();
        self.createSocketConnection();
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("connecting", function() {
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("connect_error", function() {
        // handleDisconnection()
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("close", function() {
        // self.handleDisconnection()
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("disconnect", function() {
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("reconnect", function() {
        window.isOnline = true;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("reconnecting", function() {
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("reconnect_error", function() {
        // self.handleDisconnection();
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });
    self.socket.on("reconnect_failed", function() {
        self.handleDisconnection();
        // handleDisconnection()
        window.isOnline = false;
        console.log("connection status" + window.isOnline)
    });


};


socketHandler.prototype.handleDisconnection = function() {
    // body...
    var subList = this.subscribeList["disconnect"];
    subList.forEach(function(item) {
        var cb = item["cb"];
        cb();
    })

};

socketHandler.prototype.handleConnected = function(first_argument) {
    // body...
    var subList = this.subscribeList["connect"];
    subList.forEach(function(item) {
        var cb = item["cb"];
        cb();
    })
};
socketHandler.prototype.createSocketConnection = function() {

    var len = Object.keys(this.subscribeList).length
    if (len != 0) {
        var self = this;
        self.socket.removeAllListeners();
        Object.keys(this.subscribeList).forEach(function(item) {
            var sockObj = item;

            self.doConnect(sockObj, function(bindParams, params) {
                // console.log(arguments);
                var socketType = bindParams["type"];
                var subList = this.subscribeList[socketType];
                subList.forEach(function(item) {
                    var cb = item["cb"];
                    cb(params);
                })

            }.bind(self, { type: sockObj }));

        })

    }
};


socketHandler.prototype.emit = function (message_type,msg,cb) {
    this.socket.emit(message_type,msg,cb);
};

socketHandler.prototype.subscribe = function(message_type, callback, index) {
    // body...
    if (this.subscribeList[message_type]) {
        this.subscribeList[message_type].push({
            cb: callback,
            uid: index
        });
        // this.addIndex(message_type,index);
    } else {
        // console.log(message_type)
        this.subscribeList[message_type] = [];
        this.subscribeList[message_type].push({
            cb: callback,
            uid: index
        });

        console.log(message_type)
            // this.addIndex(message_type, index);
        this.doConnect(message_type, function(bindParams, params) {
            console.log('doConnect')
            var socketType = bindParams["type"];
            var subList = this.subscribeList[socketType];
            subList.forEach(function(item) {
                console.log(item)
                var cb = item["cb"];
                cb(params);
            })

        }.bind(this, { type: message_type }))
    }

};


socketHandler.prototype.doConnect = function(message_type, callback) {
    if (this.socket) {
        this.socket.on(message_type, callback)
    }
};


socketHandler.prototype.unSubscribe = function(message_type, functionType, indexValue) {
    if (this.subscribeList[message_type] && functionType && typeof(functionType) === "function") {
        var self = this;

        if (indexValue) {
            this.subscribeList[message_type].forEach(function(obj, ind) {
                var func = obj.cb;
                var uid = obj.uid;

                if (func.toString() === functionType.toString() && uid === indexValue) {
                    self.subscribeList[message_type].splice(ind);
                }
            })

        } else {

            this.subscribeList[message_type].forEach(function(obj, ind) {
                var func = obj.cb;
                if (func.toString() === functionType.toString()) {

                    self.subscribeList[message_type].splice(ind);
                    // self.updateUniqueIndex(message_type, indexValue, ind);
                }
            })
        }
    }


};

if(!window.socketHandler) {
    window.socketHandler = new socketHandler();
}

module.exports = window.socketHandler;
