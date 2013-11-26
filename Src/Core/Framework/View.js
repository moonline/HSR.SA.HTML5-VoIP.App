(function () {
	'use strict';

	var using = App.Core.Framework.namespace;
	var Lib = using('App.Core.Lib');
	var Framework = using('App.Core.Framework');

	Framework.View = function(templateElement, viewModel) {
		this.templateElement = templateElement;
		this.template = Lib.Handlebars.compile(templateElement.getElementsByTagName('script')[0].textContent);
		this.viewModel = viewModel;
	};

	Framework.View.prototype.render = function() {
		this.templateElement.innerHTML = this.template(this.viewModel);
	};

})();