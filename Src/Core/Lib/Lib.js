(function () {
	'use strict';

	var using = App.Core.Framework.namespace;
	var Lib = using('App.Core.Lib');
	Lib.Handlebars = Handlebars;
	Lib.jQuery = jQuery.noConflict();
	//Lib.jQuery = jQuery.noConflict(true); // delete global jquery variable

})();