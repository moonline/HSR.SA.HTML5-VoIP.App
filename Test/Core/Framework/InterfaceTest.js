define(["QUnit", "Core/Framework/Interface"], function(QUnit, Interface) {
	'use strict';

	QUnit.module('Framework Utilities Tests');
	QUnit.test("Interface test", function () {
		var carInterface = new Interface('carInterface', ['drive', 'enterPerson', 'leavePerson']);
		var car = {
			implementInterface: 'carInterface',
			drive: function () {
			},
			enterPerson: function () {
			}
		};
		QUnit.raises(function () {
			carInterface.assertImplementedBy(car);
		}, 'Error', "Interface not implemented correctly");

		var vehicle = {
			implementInterface: 'carInterface',
			drive: function () {
			},
			enterPerson: function () {
			},
			leavePerson: function () {
			}
		};
		QUnit.strictEqual(carInterface.assertImplementedBy(vehicle), true, "Interface implemented correctly");
	});

});