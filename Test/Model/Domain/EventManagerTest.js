define(["QUnit","Model/Domain/EventManager"], function(QUnit, EventManager) {
		'use strict';


	QUnit.module("EventManager Tests");
	QUnit.test("EventManager Test", function () {
		QUnit.expect(1);

		EventManager.addListener({
			notify: function (event, sender) {
				QUnit.ok(event, "check notification");
			}
		}, 'call');
		EventManager.notify('call', { message: 'nothing'}, this);
		EventManager.notify('setting', { message: 'nothing'}, this);
	});

});