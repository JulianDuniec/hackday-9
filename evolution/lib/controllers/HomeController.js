module.exports = {
	get_index : function(req, res) {
		res.render('index', {
			locals: {
				section : "home",
			}
		});
	}
};