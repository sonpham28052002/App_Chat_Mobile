import * as ZIM from 'zego-zim-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZPNs from 'zego-zpns-react-native';

export const onUserLogin = async (userID, userName) => {

  var a = ZegoUIKitPrebuiltCallService.init(
    940263346, // You can get it from ZEGOCLOUD's console
    '40da48b6a31a24ddfc594d8c998e7bb36a542e86f83697fb889f2b85bf1c572a', // You can get it from ZEGOCLOUD's console
    '1111111',
    userID, // It can be any valid characters, but we recommend using a phone number.
    userName,
    [ZIM, ZPNs],
    {
      // onOutgoingCallDeclined: (callID, invitee) => {
      //   console.log('Outgoing call declined: ', callID, invitee);
      //   var chatMessage = {
      //     id: uuidv4(),
      //     sender: { id: id },
      //     seen: [{ id: id }],
      //     replyMessage: null,
      //     reply: null,
      //     messageType: 'CALLSINGLE',
      //     receiver: { id: invitee.userID },
      //     react: [],
      //     size: 0,
      //     titleFile: ' từ chối cuộc gọi video từ ',
      //     url: null
      //   };
      //   stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
      // },
      // onIncomingCallTimeout: (callID, inviter) => {
      //   console.log('Incoming call timeout: ', callID, inviter)
      //   var chatMessage = {
      //     id: uuidv4(),
      //     sender: { id: id },
      //     seen: [{ id: id }],
      //     replyMessage: null,
      //     reply: null,
      //     messageType: 'CALLSINGLE',
      //     receiver: { id: inviter.userID },
      //     react: [],
      //     size: 0,
      //     titleFile: 'bị nhở cuộc gọi video từ ',
      //     url: null
      //   };
      //   stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
      // },
      // onOutgoingCallTimeout: (callID, invitees) => {
      //   console.log('Outgoing call timeout: ', callID, invitees)
      //   var chatMessage = {
      //     id: uuidv4(),
      //     sender: { id: id },
      //     seen: [{ id: id }],
      //     replyMessage: null,
      //     reply: null,
      //     messageType: 'CALLSINGLE',
      //     receiver: { id: invitees[0].userID },
      //     react: [],
      //     size: 0,
      //     titleFile: 'bị nhở cuộc gọi video từ ',
      //     url: null
      //   };
      //   stompClient.current.send('/app/private-single-message', {}, JSON.stringify(chatMessage));
      // },
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
