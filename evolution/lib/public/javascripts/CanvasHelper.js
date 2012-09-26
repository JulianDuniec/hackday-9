
var CanvasHelpers = {

	
	drawCircle: function (x, y, width, color, ctx) {
		if (width < 0) width = 0;
		ctx.beginPath();
		ctx.arc(x, y, width, 0, Math.PI * 2, true);
		ctx.closePath();
		var grd = ctx.createRadialGradient(x, y, width, x + width, y + width, Math.floor(width));
		grd.addColorStop(0, color);
		grd.addColorStop(1, this.ColorLuminance(color, -1));
		ctx.fillStyle = grd;
		ctx.fill();
	},


	ColorLuminance : function(hex, lum) {
		// validate hex string  
		hex = String(hex).replace(/[^0-9a-f]/gi, '');
		if (hex.length < 6) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		lum = lum || 0;
		// convert to decimal and change luminosity  
		var rgb = "#", c, i;
		for (i = 0; i < 3; i++) {
			c = parseInt(hex.substr(i * 2, 2), 16);
			c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
			rgb += ("00" + c).substr(c.length);
		}
		return rgb;
	}
};