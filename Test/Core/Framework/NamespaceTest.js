(function () {
	'use strict';

	module('Namespace Tests');
	test("Namespace exists test", function () {
		ok(App.Core.Framework.namespace);
	});

	test("Namespace creation works test", function() {
		strictEqual(typeof(App.Testnamespace),'undefined');
		App.Core.Framework.namespace('App.Testnamespace.Domain.Channel');
		deepEqual(App.Testnamespace.Domain,{ Channel: {}});

		delete App.Testnamespace;
	});
})();