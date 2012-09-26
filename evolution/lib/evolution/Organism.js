
module.exports = function(options) {
	var me = {};

	me.alive = true;
	me.brain = options.brain;
	me.rotation = 0;
	//The data that will be pushed to client
	me.data = {};
	//What type of thing this is
	me.data.classTag = "organism";
	me.data.position = options.position || {x : 0, y : 0};
	
	me.update = function(world) {
		var result = me.brain.run(world);
		var leftTrack = result[0];
		var rightTrack = result[1];
		me.data.position.x += leftTrack - 0.5;
		me.data.position.y += rightTrack - 0.5;
	};

	me.clamp = function(val, min, max) {
		if(val < min) {
			val = min;
		}
		if(val > max) {
			val = max;
		}
		return val;
	};

	return me;
}