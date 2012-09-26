var 
	mongoose = require('mongoose'),
	config = require('config'),
	aboutController = require('../../controllers/AboutController');

module.exports.controllerTests = {
	setUp : function(cb) {
		mongoose.connect(config.database.host, function(){
			cb();
		});
	},
	
	tearDown : function(cb) {
		mongoose.disconnect(function() {cb();});
	},

	get_index : function(test) {
		aboutController.get_index(null, {
			render : function(name, viewData) {
				test.equal(name, 'about/index');
				test.equal(viewData.locals.section, "about");
				test.equal(viewData.locals.subSection, "index");
				test.done();
			}
		})
	},

	post_company : function(test) {
		aboutController.post_company({
			params : {
				name : "CoolCo"
			}
		}, {
			redirect: function(url) {
				test.equal(url, "/about/company/coolco");
				test.done();
			}
		})
	},
	
	get_company : function(test) {
		aboutController.get_company(null, {
			render : function(name, viewData) {
				test.equal(name, 'about/company');
				test.equal(viewData.locals.section, "about");
				test.equal(viewData.locals.subSection, "company");
				test.done();
			}
		})
	}
}