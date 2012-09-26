

$(document).ready(function() {
	var gameInstance = new game();

	var clientInstance = new client({ 
		message : function(message) {
			
			switch (message.type) {
				case "state":
					//hook up the state-message with the game-instance.
					gameInstance.setState(message.data);
					break;
			}
		}
	});

	clientInstance.init();
});
