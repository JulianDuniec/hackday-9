var 
	Organism = require('./Organism'),
	nn = require('neural-node');


module.exports = function(options) {
	var me = {};
	
	me.initSettings = {
		organismCount : 100
	};

	me.geneticAlgorithm = new nn.GeneticAlgorithm({
		mutationRate : 0.25,
		maxPerbutation : 0.1,
		survivalRate : 0.02
	});

	me.webSocketServer = options.webSocketServer;
	
	me.worldState = [];
	
	me.width = 600;
	me.height = 600;

	me.goalPosition = {
		x : 10,
		y : 10
	};
	me.currentCycle = 0;
	me.maxCycles = 1000;
	//INPUTS:
	
	me.initBrains = function() {
		var brains = [];
		for(var i = 0; i < me.initSettings.organismCount; i++) {
			var brain = new nn.NeuralNetwork({
				numberOfInputs : 4,
				numberOfOutputs : 2,
				numberOfHiddenLayers : 2,
				numberOfNeuronsPerHiddenLayer : 10,
				weights : initialBrain
			});
			brain.fitness = 0;
			brains.push(brain);
		}
		return brains;
	}
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
		//Split
		var data = [];
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
				item.data.fitness = item.brain.fitness;
				data.push(item.data);
			}
		});
		me.webSocketServer.sendToGroup("evolution", {type : "state", data : { 
			items : data,
			goal : me.goalPosition
		}});
			
		if(++me.currentCycle > me.maxCycles || aliveCount == 0) {
			me.updatePopulation();
			me.currentCycle = 0;
			me.goalPosition = {x : Math.random() * me.width, y : Math.random() * me.height};
			console.log("cycle");
		}
		//Join
	};

	me.init(me.initBrains());

	return me;
};

var initialBrain = [ 0.12213662983849569,
  -2.1072757353540505,
  -0.8735579341650022,
  -0.04438664335757517,
  1.4629092380870143,
  0.8157879641745238,
  -0.0827407911885525,
  -0.6256915217265487,
  0.2043139555025848,
  -0.832079505221918,
  -1.2453962431289243,
  0.15391078745014983,
  0.30595698761753654,
  2.4511552833020653,
  -0.10266666058450949,
  1.5261955602094524,
  -1.3578775097616018,
  1.4499129319097859,
  0.03129416070878499,
  -0.9960279200691732,
  -1.1209398454520858,
  1.3455135480500757,
  -1.669766030227766,
  -0.19954187651164834,
  -0.6014566788915552,
  1.0680105499457568,
  0.4207878558896482,
  0.5954241671133786,
  0.5988989733625206,
  -1.2777409377973528,
  1.2071731190662838,
  -1.8827703492715968,
  -0.4914477856829764,
  1.2505103220697493,
  0.4946826157625759,
  -0.6118622606620194,
  0.9417130702640857,
  0.9116557306144392,
  0.4217576639261096,
  -1.200175244547426,
  0.746692148689181,
  -2.228916610637679,
  1.5720730860717593,
  -0.29726324272341986,
  1.092012713290751,
  -0.33419213187880803,
  0.3723198289982984,
  0.7114127700217056,
  0.11275405697524585,
  -0.5406720911618322,
  -1.6490416574757552,
  -0.941036824695766,
  0.1258156544994568,
  1.371072134375572,
  -0.8343219181057067,
  0.8618321816436946,
  1.5179998983629057,
  -1.985718336328864,
  0.029042936302721645,
  -0.6419401905499406,
  -0.5378635565284637,
  -0.8567775303963571,
  -1.3597263508941977,
  -0.037873160885645754,
  -0.8339807783253496,
  0.7562379538547249,
  -1.7773663971573124,
  0.8672398649156084,
  0.02145534083247187,
  -0.1691088339313867,
  1.9185112053062758,
  1.1909229001495991,
  0.6803057037759574,
  -1.4207633081357924,
  -1.4575588716659695,
  0.613719588471577,
  -1.2475509664509457,
  0.01248636795207864,
  -0.8351801490876821,
  0.5715713246259823,
  -0.25792346959933554,
  -0.34956903592683325,
  -1.5536100104451172,
  -1.3309936949517582,
  -0.6356913802679631,
  0.4126059598755088,
  0.017395384656265223,
  0.31168452859856144,
  -0.3959916556719696,
  -2.274781481083482,
  -1.2248036886099736,
  0.7813082887791102,
  0.751132221706212,
  -1.1521773741114891,
  -0.9491481736768037,
  -0.23083110968582304,
  -0.7274955225642771,
  -0.6913039860315618,
  -1.1280567066743967,
  -0.01688620685599747,
  -0.3509946187026791,
  -0.15771230184473062,
  -0.377581499842927,
  -0.7011749387718736,
  1.2305072601418938,
  -0.7353312714491044,
  -0.269055979605764,
  0.534120252076536,
  -0.15697011095471658,
  -0.015146396262571478,
  -0.6629448734689504,
  -0.5056779241189361,
  -0.4523648090194911,
  -1.3269374497700488,
  -1.0531983705703174,
  0.563218757649883,
  0.4656623347196728,
  2.9394525602925565,
  -1.0392631405498842,
  -0.4664199018385261,
  0.39770362712442864,
  -1.3954732190817607,
  -2.12436515847221,
  1.0622727883979675,
  -0.05128267155960242,
  0.17550178132951255,
  -0.7437563464045523,
  2.3594933971762657,
  -0.37868172628805064,
  0.18855813127011045,
  1.9231429825071242,
  -0.8082598980981849,
  -1.1925104092806573,
  0.43817970287054786,
  -1.7741763742174945,
  -0.6500578244682401,
  -2.6780840622726823,
  -1.124893987458199,
  0.019976606732234503,
  -1.6794039358384911,
  -0.10267950058914721,
  -1.4953259074594822,
  0.44785928786732254,
  0.10712408730760195,
  0.2897516904398799,
  -1.5070490639656786,
  0.6144005040172488,
  0.77106887511909,
  -1.5024441647808988,
  -0.17625946183688937,
  0.7437697888817636,
  0.9609245111234491,
  -2.0511623749975123,
  2.668156816950068,
  -0.31563514042645685,
  1.0103193541523057,
  1.0555855389218778,
  0.46698122504167205,
  0.9488121361471707,
  -0.11087266737595214,
  -0.7118772107642148,
  1.3910357024520636,
  0.5548149546608332,
  -1.2460346465464698,
  1.5462850764859462,
  -0.2903714905958621,
  -1.2699977575801327,
  -1.682483010087162,
  0.9060282708145682,
  -1.5512695407960568,
  -2.395857007661831,
  -0.8750035027507698,
  -0.8485827137716119,
  2.3573625128250564,
  -0.3082881748676299,
  0.08702749027870582,
  0.7508172124158592,
  1.3003496771678336,
  -0.760653849272056,
  0.14952339269220813,
  0.9641932546626789,
  0.01589434999041222,
  0.45965212206356215,
  -1.3175716279074545,
  -1.8371673547662803,
  -0.027146771922707646,
  2.1104406682774437,
  -0.15788771314546474,
  0.01243618149310352,
  0.5383099862374368 ];
