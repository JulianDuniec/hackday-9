var client = function(options) {
	var me = {};
	
	var url = "ws://localhost:8090";
	
	me.init = function() {
		var WebSocket = window.WebSocket || window.MozWebSocket;
		var connection = new WebSocket(url);

		connection.onopen = function() {
			connection.send(JSON.stringify({
				type : "join_group",
				group : "evolution"
			}))
		};

		connection.onmessage = function(message) {
			options.message(JSON.parse(message.data));
		};

		connection.onerror = function() {
			alert('WEBSOCKET ERROR');
		};

	};
	
	return me;
};