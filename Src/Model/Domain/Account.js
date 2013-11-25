(function () {
	'use strict';

	var Domain = App.Model.Domain;

	Domain.Account = function(type, fields) {
		this.type = type;
		this.fields = fields;
	};

})();