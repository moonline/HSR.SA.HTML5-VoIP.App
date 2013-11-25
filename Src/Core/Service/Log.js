(function() {
	'use strict';

	var Service = App.Core.Service;

	Service.Log = {
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
		 * @param App.Core.Service.Log.logType logType: type of the log event
		 * @param causer: the Object which causes the log event
		 * @param message: the log message
		 */
		log:function(logType, causer, message) {
			if(Service.Log.logLevel <= logType) {
				if(logType === Service.Log.logTypes.Info) {
					console.info(causer+': '+message);
				} else if (logType === Service.Log.logTypes.Error) {
					console.warn(causer+': '+message);
				} else {
					console.log(causer+': '+message);
				}
			}
		}
	};

	Service.Log.logLevel = App.Core.Service.Log.logLevels.All;

})();