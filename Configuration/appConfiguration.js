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
			{
				"name": "Remote Json Contactbook",
				"type": 'AddressbookRemoteJson'
			}
		]
	},
	"contactbookVcardConfig": [
		{
			"path": ["VERSION"],
			"mapTo": ['version']
		},{
			"path": ["N"],
			"mapTo": {
				0: ['lastname'],
				1: ['firstname']
			}
		},{
			"path": ["FN"],
			"mapTo": ['name']
		},{
			"path": ["ADR", "HOME", "POSTAL"],
			"mapTo": {
				2: ['address','street'],
				3: ['address','city'],
				4: ['address','region'],
				5: ['address','postcode'],
				6: ['address','country']
			}
		},{
			"path": ["NICKNAME"],
			"mapTo": ['nickname']
		},{
			"path": ["TEL", "CELL", "VOICE"],
			"mapTo": ['phone'],
			"mappingRule": 'list'
		},{
			"path": ["TEL", "HOME","VOICE"],
			"mapTo": ['phone'],
			"mappingRule": 'list'
		},{
			"path": ["TEL"],
			"mapTo": ['phone'],
			"mappingRule": 'list'
		},{
			"path": ["EMAIL", "PREF", "INTERNET"],
			"mapTo": ['email'],
			"mappingRule": 'list'
		},{
			"path": ["EMAIL", "INTERNET"],
			"mapTo": ['email'],
			"mappingRule": 'list'
		},{
			"path": ["BDAY"],
			"mapTo": ['birthdate']
		},{
			"path": ["X-SIP"],
			"mapTo": ["sip"]
		},{
			"path": ["X-SIP"],
			"mapTo": ["sip"]
		},{
			"path": ["PHOTO"],
			"mapTo": ["photo"]
		},{
			"path": ["ORG"],
			"mapTo": ["organisation"]
		},{
			"path": ["URL"],
			"mapTo": ["website"]
		}
	]
};