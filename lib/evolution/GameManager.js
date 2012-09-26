var 
	Organism = require('./Organism'),
  InitialBrain = require('./InitialBrain'),
	nn = require('neural-node');


module.exports = function(options) {
	var me = {};
	
  me.setRandomGoal = function() {
      me.goalPosition = {x : Math.random() * me.width, y : Math.random() * me.height};
  };

	me.initSettings = {
		organismCount : 100,
    useInitialBrain : true,
    mutationRate : 0.25,
    maxPerbutation : 0.1,
    survivalRate : 0.02
	};

	me.geneticAlgorithm = new nn.GeneticAlgorithm({
		mutationRate : me.initSettings.mutationRate,
		maxPerbutation : me.initSettings.maxPerbutation,
		survivalRate : me.initSettings.survivalRate
	});

	me.webSocketServer = options.webSocketServer;
	
	me.worldState = [];
	
	me.width = 600;
	me.height = 600;

  //Sets a random goal for the organisms to hunt
	me.setRandomGoal();

	me.currentCycle = 0;
	me.maxCycles = 1000;

	
	me.initBrains = function() {
		var brains = [];
		for(var i = 0; i < me.initSettings.organismCount; i++) {
      var brainSettings = {
        numberOfInputs : 4,
        numberOfOutputs : 2,
        numberOfHiddenLayers : 2,
        numberOfNeuronsPerHiddenLayer : 10
      };
      if(me.initSettings.useInitialBrain)
        brainSettings.weights = InitialBrain;
			var brain = new nn.NeuralNetwork(brainSettings);
			brain.fitness = 0;
			brains.push(brain);
		}
		return brains;
	};

	me.init = function(brains) {
		me.worldState = [];
		for(var i = 0; i < me.initSettings.organismCount; i++) {
			brains[i].fitness = 0;
			var organism = new Organism({
				brain : brains[i],
				position : {x :me.width/2, y :me.height/2}});
			me.worldState.push(organism);
		}
	};

	me.survivalCheck = function(item) {
		return item.data.position.x > 0 && item.data.position.y > 0 && item.data.position.x < me.width && item.data.position.y < me.height;
	};

	me.updatePopulation = function() {
		var brains = [];
		var highestFitness = -99999;
		var bestBrain = null;
		me.worldState.forEach(function(item) {
			if(item.alive == false)
				item.brain.fitness -= 999;
			if(item.brain.fitness > highestFitness)
			{
				bestBrain = item.brain;
				highestFitness = item.brain.fitness;
			}
			brains.push(item.brain);
		});
		console.log("**********BEST BRAIN *************");
		console.log(bestBrain.export().weights);
		brains = me.geneticAlgorithm.epoch(brains);
		me.init(brains);
	};

	me.distance = function(point1, point2) {
		var xs = 0;
		  var ys = 0;
		 
		  xs = point2.x - point1.x;
		  xs = xs * xs;
		 
		  ys = point2.y - point1.y;
		  ys = ys * ys;
		 
		  return Math.sqrt( xs + ys );
	};


	me.cycle = function() {
		var data = [];
    //Keeps track of alive-count. 
    //If entire population dies, we want to trigger a new cycle
		var aliveCount = 0;

		me.worldState.forEach(function(item) {
			
			if(!me.survivalCheck(item))
				item.alive = false;
			if(item.alive == true) {
				++aliveCount;
				var prevDistance = me.distance(item.data.position, me.goalPosition);
				var i1 = item.data.position.x / me.width;
				var i2 = item.data.position.y / me.height;
				var i3 = me.goalPosition.x / me.width;
				var i4 = me.goalPosition.y / me.height;
				item.update([i1, i2, i3, i4]);
				var newDistance = me.distance(item.data.position, me.goalPosition);
				item.brain.fitness += prevDistance > newDistance ? 1 : -1;
				
        //Only push living items to clients.
        item.data.fitness = item.brain.fitness;
				data.push(item.data);
			}
		});
    //Push data to clients
		me.webSocketServer.sendToGroup("evolution", {type : "state", data : { 
			items : data,
			goal : me.goalPosition
		}});
			
		if(++me.currentCycle > me.maxCycles || aliveCount == 0) {
			me.updatePopulation();
			me.currentCycle = 0;
		  me.setRandomGoal();
			console.log("cycle");
		}
	};


	me.init(me.initBrains());

	return me;
};

