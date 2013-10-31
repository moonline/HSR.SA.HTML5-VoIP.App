/**
 * Created by tobias on 10/30/13.
 */

var Service = App.Core.Service;

Service.FileService = {};
Service.FileService.readFile = function(file, callback) {
	if (file) {
		var reader = new FileReader();
		reader.onload = function(event) {
			callback(event.target.result);
		};
		reader.readAsText(file);
	} else {
		Service.Log(Service.Log.logTypes.Error, 'FileService', "Can not read file "+file);
	}
};