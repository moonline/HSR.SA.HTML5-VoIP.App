App.Configuration = {
	"accounts": [
		{
			"channelType": 'ChannelXHR',
			"username": 'maxmuster',
			"password": '***'
		}
	],

	"stunService": "", // not used allready

	"connection" : {
		"connectTimeout": 30, // sec
		// Does not work -  browser does not support
		"quality": {
			"video": {
				/** standardisized resolutions
				 1280, 720,
				 960, 720,
				 640, 360,
				 640, 480,
				 320, 240,
				 320, 180
				 */
				"mandatory": {
					"maxHeight": 640,
					"maxWidth": 480
					//"width": { "min": 160, "max": 1280 },
					//"height": { "min": 120, "max": 960 }
				},
				"optional": []
			}
		}
	},

	"contactbookImport": {
		"file": [
			{
				"name": "Json Import",
				"type": 'AddressbookJson',
				"fileEnding": ["json", "js","jsn"]
			}
		],
		"directory": [
			{
				"name": "VCard Import",
				"type": 'AddressbookVcard'
			}
		],
		"online": [

		]
	}
};