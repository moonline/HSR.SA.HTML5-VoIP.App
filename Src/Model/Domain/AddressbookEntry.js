/**
 * Created by tobias on 10/8/13.
 */
var Domain = App.Model.Domain;


Domain.AddressbookEntry = function(sip, name, photo) {
	this.sip = sip;
	this.name = name;
	this.photo = photo;
}