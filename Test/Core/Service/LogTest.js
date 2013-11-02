'use strict';

(function () {
	var Service = App.Core.Service;

	module('Log Tests');
	test("Log Test", function () {
		(function () {
			Service.Log.logLevel = App.Core.Service.Log.logLevels.All;
			var logBuffer = null, infoBuffer = null, warnBuffer = null;

			var bufferReset = function () {
				logBuffer = null;
				infoBuffer = null;
				warnBuffer = null;
			};

			console.log = function (message) {
				logBuffer = message;
			};
			console.info = function (message) {
				infoBuffer = message;
			};
			console.warn = function (message) {
				warnBuffer = message;
			};

			Service.Log.log(Service.Log.logTypes.Info, 'LogTest', 'Info log');
			strictEqual(infoBuffer, 'LogTest: Info log', 'check correct info logging (level all)');
			strictEqual(warnBuffer, null, 'check empty buffer');
			strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Service.Log.log(Service.Log.logTypes.Error, 'LogTest', 'Error log');
			strictEqual(warnBuffer, 'LogTest: Error log', 'check correct error logging (level all)');
			strictEqual(infoBuffer, null, 'check empty buffer');
			strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Service.Log.logLevel = App.Core.Service.Log.logLevels.Error;
			Service.Log.log(Service.Log.logTypes.Error, 'LogTest', 'Error log 2');
			Service.Log.log(Service.Log.logTypes.Info, 'LogTest', 'Info log 2');
			strictEqual(warnBuffer, 'LogTest: Error log 2', 'check correct error logging (level error)');
			strictEqual(infoBuffer, null, 'check empty buffer');
			strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Service.Log.logLevel = App.Core.Service.Log.logLevels.None;
			Service.Log.log(Service.Log.Error, 'LogTest', 'Error log 3');
			Service.Log.log(Service.Log.logTypes.Info, 'LogTest', 'Info log 3');
			strictEqual(warnBuffer, null, 'check empty buffer (level none)');
			strictEqual(infoBuffer, null, 'check empty buffer');
			strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Service.Log.logLevel = App.Core.Service.Log.logLevels.All;
		})();
	});

})();