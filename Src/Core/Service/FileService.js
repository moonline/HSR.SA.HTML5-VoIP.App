'use strict';

(function() {
	var Service = App.Core.Service;
	Service.FileService = {};

	/**
	 * read file on harddisk
	 *
	 * @param file: file path
	 * @param callback: function to call on success
	 */
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

})();