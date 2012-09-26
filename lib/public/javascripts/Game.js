

var game = function(options) {
	var me = {};
	
	me.canvas = document.getElementById("canvas");
	
	me.context = me.canvas.getContext("2d");

	me.clear = function() {
		// Store the current transformation matrix
		me.context.save();

		// Use the identity matrix while clearing the canvas
		me.context.setTransform(1, 0, 0, 1, 0, 0);
		me.context.clearRect(0, 0, canvas.width, canvas.height);

		// Restore the transform
		me.context.restore();
	};

	me.setState = function(state) {
		me.state = state;
		
		me.render();
	};
	
	me.render = function() {
		me.clear();
		for (var i = me.state.items.length - 1; i >= 0; i--) {
			Drawer.draw(me.state.items[i], me.context);
		};
		$('.icon-heart').offset({top : me.state.goal.y - 22, left : me.state.goal.x - 22});
	};

	return me;
};