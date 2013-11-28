define(function() {
	'use strict';

	var Log = {
		logLevels: {
			All: 0,
			Error: 10,
			None: 20
		},
		logTypes: {
			Info: 0,
			Error: 10
		},


		/**
		 * log message to console
		 *
		 * @param App.Core.Log.logType logType: type of the log event
		 * @param causer: the Object which causes the log event
		 * @param message: the log message
		 */
		log:function(logType, causer, message) {
			if(Log.logLevel <= logType) {
				if(logType === Log.logTypes.Info) {
					console.info(causer+': '+message);
				} else if (logType === Log.logTypes.Error) {
					console.warn(causer+': '+message);
				} else {
					console.log(causer+': '+message);
				}
			}
		}
	};

	Log.logLevel = Log.logLevels.All;

	return Log;
});