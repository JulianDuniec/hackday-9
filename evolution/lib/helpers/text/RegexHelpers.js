module.exports = {
	makeUrlName : function(s) {
		return s
			.toLowerCase()
			.replace('å', 'a')
			.replace('ä', 'a')
			.replace('ö', 'o')
			.replace(/[^a-z0-9_\.~]+/g, "-");
	}
};