define(["Handlebars"], function(Handlebars) {
	'use strict';


	var View = function(templateElement, viewModel) {
		this.templateElement = templateElement;
		this.template = Handlebars.compile(templateElement.getElementsByTagName('script')[0].textContent);
		this.viewModel = viewModel;
	};

	View.prototype.render = function() {
		this.templateElement.innerHTML = this.template(this.viewModel);
	};

	return View;
});