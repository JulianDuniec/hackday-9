var Drawer = {
	/*
		Draws the supplied object on the supplied 2d-context
	*/
	draw : function(object, ctx) {
		switch(object.classTag)  {
			case "organism":
				Drawer.drawOrganism(object, ctx);
				break;
		}
	},

	drawOrganism : function(object, ctx) {
		var color = object.fitness > 0 ? "#22E01B" : "#590000";
		CanvasHelpers.drawCircle(object.position.x, object.position.y, 5, color, ctx);
	}
};