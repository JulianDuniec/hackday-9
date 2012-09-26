var 
	config = require('config'),
	gameManager = require('./lib/evolution/GameManager'),
	webSocketServer = require('./lib/websockets/WebSocketServer'),
	webserver = require('./lib/http/webserver');

new webserver({
  	port : process.env.PORT || config.webserver.port || 8080
  })
  .start();

var webSocketServer = new webSocketServer({
	port : 8090
});

webSocketServer.start();

var gameManager = new gameManager({webSocketServer : webSocketServer});

function loop() {
	gameManager.cycle();
	setTimeout(loop, 3);
}

loop();


