App.Configuration = {
	// Todo: move to a user storage
	"lastName": "Caller name",
	"firstName": "Caller firstname",
	"photo": "base64 image string",
	"sip": "yourSipId@sipHost.tld",

	"stunService": "", // not used allready

	"connection" : {
		"connectTimeout": 30 // sec
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