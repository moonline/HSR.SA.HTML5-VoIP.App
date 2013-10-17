/**
 * Created by tobias on 10/16/13.
 */
var Service = App.Core.Service;

Service.Log = {
	logLevels: {
		All: 0,
		Error: 1,
		None: 2
	},
	logTypes: {
		Info: 0,
		Error: 1
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
			console.log(causer+': '+message);
		}
	}
};

Service.Log.logLevel = App.Core.Service.Log.logLevels.All;