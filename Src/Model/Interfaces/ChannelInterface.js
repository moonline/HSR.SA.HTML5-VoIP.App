/**
 * Created by tobias on 10/12/13.
 */
var Interfaces = App.Model.Interfaces;
var Framework = App.Core.Framework;


Interfaces.ChannelInterface = new Framework.Interface('ChannelInterface', ['start', 'stop', 'send', 'addReceiveListener', 'removeReceiveListener']);