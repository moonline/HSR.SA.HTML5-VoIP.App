'use strict';

(function () {
	var Framework = App.Core.Framework;


	test("Interface test", function () {
		var carInterface = new Framework.Interface('carInterface', ['drive', 'enterPerson', 'leavePerson']);
		var car = {
			implementInterface: 'carInterface',
			drive: function () {
			},
			enterPerson: function () {
			}
		};
		raises(function () {
			carInterface.implementedBy(car);
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
		strictEqual(carInterface.implementedBy(vehicle), true, "Interface implemented correctly");
	});

})();