define(["QUnit", "Core/Service/Log" ], function(QUnit, Log) {
	'use strict';


	QUnit.module('Log Tests');
	QUnit.test("Log Test", function () {
		(function () {
			Log.logLevel = Log.logLevels.All;
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

			Log.log(Log.logTypes.Info, 'LogTest', 'Info log');
			QUnit.strictEqual(infoBuffer, 'LogTest: Info log', 'check correct info logging (level all)');
			QUnit.strictEqual(warnBuffer, null, 'check empty buffer');
			QUnit.strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Log.log(Log.logTypes.Error, 'LogTest', 'Error log');
			QUnit.strictEqual(warnBuffer, 'LogTest: Error log', 'check correct error logging (level all)');
			QUnit.strictEqual(infoBuffer, null, 'check empty buffer');
			QUnit.strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Log.logLevel = Log.logLevels.Error;
			Log.log(Log.logTypes.Error, 'LogTest', 'Error log 2');
			Log.log(Log.logTypes.Info, 'LogTest', 'Info log 2');
			QUnit.strictEqual(warnBuffer, 'LogTest: Error log 2', 'check correct error logging (level error)');
			QUnit.strictEqual(infoBuffer, null, 'check empty buffer');
			QUnit.strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Log.logLevel = Log.logLevels.None;
			Log.log(Log.Error, 'LogTest', 'Error log 3');
			Log.log(Log.logTypes.Info, 'LogTest', 'Info log 3');
			QUnit.strictEqual(warnBuffer, null, 'check empty buffer (level none)');
			QUnit.strictEqual(infoBuffer, null, 'check empty buffer');
			QUnit.strictEqual(logBuffer, null, 'check empty buffer');
			bufferReset();

			Log.logLevel = Log.logLevels.All;
		})();
	});

});