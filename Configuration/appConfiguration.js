define({
	"user":null, // this setting ist set by the accountManager

	"storagePrefix": "app-pro-",

	"connection" : {
		"connectTimeout": 60, // sec
		// used but does not work -  browser do not support yet
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
				}
			}
		}
	},

	"channels" : [
		{
			"name": "XHR Messenger",
			"serviceId": "XHRmessenger",
			"type": "Model/Domain/Channel/ChannelXHR",
			"userIdField": "nick"
		}
	],

	"contactbookImport": {
		"file": [
			{
				"name": "Json Import",
				"type": 'Model/Domain/Addressbook/AddressbookJson',
				"fileEnding": ["json", "js","jsn"]
			}
		],
		"directory": [
			{
				"name": "VCard Import",
				"type": 'Model/Domain/Addressbook/AddressbookVcard'
			}
		],
		"online": [
			{
				"name": "Remote Json Contactbook",
				"type": 'Model/Domain/Addressbook/AddressbookRemoteJson'
			}
		]
	}
});