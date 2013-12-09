define({
	"fieldMapping": [
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
			"mapTo": ['nick']
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