/**
 * Created by tobias on 10/8/13.
 */
var Interfaces = App.Model.Interfaces;
var Framework = App.Core.Framework;


Interfaces.AddressbookInterface = new Framework.Interface('AddressbookInterface', ['getEntries', 'count', 'load']);