var 
	webSocketServer = require('websocket').server,
	http = require('http');

module.exports = function(options) {
	
	var me = {};
	
	me.start = function() {
		//Contains all connected clients
		me.clients = [];

		me.groups = [];

		me.httpServer = http.createServer(function(request, response) {
			//No implementation
		});

		
		me.httpServer.listen(options.PORT || 8090, function() {
		
		});

		me.websocketServer = new webSocketServer({httpServer : me.httpServer});

		me.websocketServer.on('request', me.clientConnected);
	};

	me.clientConnected = function(request) {
		var connection = request.accept(null, request.origin);
		var uid = Math.random();
		console.log(uid + " connected");
		me.clients[uid] = connection;

		connection.on('close', function() {
			me.clientDisconnected(uid);
		});

		connection.on('message', function(message) {
			console.log("Got message: " + message.utf8Data);
			message = JSON.parse(message.utf8Data);
			switch(message.type) {
				case "join_group":
					me.joinGroup(uid, message.group);
					break;
			}
		});
	};

	me.joinGroup = function(uid, groupName) {
		console.log(uid + " joins group " + groupName);
		if(!me.groups.hasOwnProperty(groupName)) {
			me.groups[groupName] = {
				clients : []
			};
		}
		if(!~me.groups[groupName].clients.indexOf(uid)) {
			me.groups[groupName].clients.push(uid);
		}
	};

	me.leaveGroup = function(uid, groupName) {
		console.log(uid + " leaves group " + groupName);
		if(me.groups.hasOwnProperty(groupName)) {
			var clientIndex = me.groups[groupName].clients.indexOf(uid);
			if(!!~clientIndex) {
				me.groups[groupName].clients.splice(clientIndex,1);
				if(me.groups[groupName].clients.length == 0)
					delete me.groups[groupName];
			}
		}
	};

	me.sendToGroup = function(groupName, message) {

		if(me.groups.hasOwnProperty(groupName)) {
			for(var i = 0; i < me.groups[groupName].clients.length; i++) {
				me.send(me.groups[groupName].clients[i], message);
			}
		}
	};

	me.leaveAllGroups = function(uid) {
		for(key in me.groups) {
			me.leaveGroup(uid, key);
		}
	};

	me.send = function(uid, data) {
		me.clients[uid].sendUTF(JSON.stringify(data));
	};

	me.clientDisconnected = function(uid) {
		console.log(uid + " disconnected");
		me.leaveAllGroups(uid);
		delete me.clients[uid];
	};

	return me;
}