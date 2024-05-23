import * as ZIM from 'zego-zim-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZPNs from 'zego-zpns-react-native';

export const onUserLogin = async (userID, userName) => {

  var a = ZegoUIKitPrebuiltCallService.init(
    940263346, // You can get it from ZEGOCLOUD's console
    '40da48b6a31a24ddfc594d8c998e7bb36a542e86f83697fb889f2b85bf1c572a', // You can get it from ZEGOCLOUD's console
    userID, // It can be any valid characters, but we recommend using a phone number.
    userName,
    [ZIM, ZPNs],
    {
      onIncomingCallDeclineButtonPressed: (navigation) => {
        console.log('onIncomingCallDeclineButtonPressed: ', navigation);
      },
      onIncomingCallAcceptButtonPressed: (navigation) => {
        console.log('onIncomingCallAcceptButtonPressed: ', navigation);
      },
      onOutgoingCallCancelButtonPressed: (navigation, callID, invitees, type) => {
        console.log('onOutgoingCallCancelButtonPressed: ', navigation, callID, invitees, type);
      },
      onIncomingCallReceived: (callID, inviter, type, invitees) => {
        console.log('Incoming call: ', callID, inviter, type, invitees)
      },
      onIncomingCallCanceled: (callID, inviter) => {
        console.log('Incoming call canceled: ', callID, inviter)
      },
      onOutgoingCallAccepted: (callID, invitee) => {
        console.log('Outgoing call accepted: ', callID, invitee)
      },
      onOutgoingCallRejectedCauseBusy: (callID, invitee) => {
        console.log('onOutgoingCallRejectedCauseBusy: ', callID, invitee);
      },
      onOutgoingCallDeclined: (callID, invitee) => {
        console.log('Outgoing call declined: ', callID, invitee)
      },
      onIncomingCallTimeout: (callID, inviter) => {
        console.log('Incoming call timeout: ', callID, inviter)
      },
      onOutgoingCallTimeout: (callID, invitees) => {
        console.log('Outgoing call timeout: ', callID, invitees)
      },
      ringtoneConfig: {
        incomingCallFileName: require('../../assets/ringtone-205162.mp3'),
        outgoingCallFileName: require('../../assets/happy-pop-1-185286.mp3'),
      },
      androidNotificationConfig: {
        channelID: 'ZegoUIKit',
        channelName: 'ZegoUIKit',
      },
    },
  );
  return a;
};
