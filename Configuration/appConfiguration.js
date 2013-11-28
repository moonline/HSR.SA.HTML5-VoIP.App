define({
	"user":null, // this setting ist set by the accountManager

	"stunService": "", // not used allready

	"connection" : {
		"connectTimeout": 60, // sec
		// Does not work -  browser do not support yet
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

	"channels" : [
		{
			"name": "XHR Messenger",
			"type": "ChannelXHR"
		}
	],

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
			"path": ["ADR", "HOME", "POSTAL"], // ADR;HOME;POSTAL:Address extra, Street/Nr, City, Region, Postcode/Zip, Country
			"mapTo": {
				2: ['address','street'], // mount second field (Street/Nr) in vcard  to address.street in the js object
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
			"mappingRule": 'list' // there can be multiple fields in the js object 'phone' -> make a list
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
});