App.Configuration = {
	// Todo: move to a user storage
	"lastName": "Caller name",
	"firstName": "Caller firstname",
	"photo": "base64 image string",
	"sip": "yourSipId@sipHost.tld",

	"stunService": "", // not used allready

	"connection" : {
		"connectTimeout": 30, // sec
		"quality": {
			"video": {
				/** list from standard
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
				"optional": []/*,
				"optional" : [
					{
						"frameRate": {
							"min": 10,
							"max": 25
						}
					},
					{
						"width": {
							"min": 160,
							"max": 320
						}
					},
					{
						"height": {
							"min": 120,
							"max": 240
						}
					}
				]*/
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