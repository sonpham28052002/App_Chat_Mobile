import React, { useEffect } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeChat from '../listChat/HomeChat';
import HomeUser from '../user/HomeUser';
import ContactHome from '../user/ContactHome'
import { save } from '../../../Redux/slice';
import axios from 'axios';
import host from '../../../configHost';
import * as ZIM from 'zego-zim-react-native';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZPNs from 'zego-zpns-react-native';
// import { onUserLogin } from '../../../function/zegoCloud/onUserLogin';
// import { ZIMKit } from '@zegocloud/zimkit-rn';
// import * as ZIM from 'zego-zim-react-native';
// import ZegoUIKitPrebuiltCallService from "@zegocloud/zego-uikit-prebuilt-call-rn";

const Tab = createMaterialBottomTabNavigator();

const TabHome = ({ route }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && route.params.id) {
          // Gọi API để lấy thông tin người dùng nếu có
          const response = await axios.get(`${host}users/getUserById?id=${route.params.id}`);
          dispatch(save(response.data)); 
          // onUserLogin(response.data.id, response.data.userName)
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, [dispatch, route.params]);

  // const onUserLogin = async (userID, userName) => {
  //   var a = ZegoUIKitPrebuiltCallService.init(
  //     940263346, // You can get it from ZEGOCLOUD's console
  //     '40da48b6a31a24ddfc594d8c998e7bb36a542e86f83697fb889f2b85bf1c572a', // You can get it from ZEGOCLOUD's console
  //     userID, // It can be any valid characters, but we recommend using a phone number.
  //     userName,
  //     [ZIM, ZPNs],
  //     {
  //       onIncomingCallDeclineButtonPressed: (navigation) => {
  //         console.log('onIncomingCallDeclineButtonPressed: ', navigation);
  //       },
  //       onIncomingCallAcceptButtonPressed: (navigation) => {
  //         console.log('onIncomingCallAcceptButtonPressed: ', navigation);
  //       },
  //       onOutgoingCallCancelButtonPressed: (navigation, callID, invitees, type) => {
  //         console.log('onOutgoingCallCancelButtonPressed: ', navigation, callID, invitees, type);
  //       },
  //       onIncomingCallReceived: (callID, inviter, type, invitees) => {
  //         console.log('Incoming call: ', callID, inviter, type, invitees)
  //       },
  //       onIncomingCallCanceled: (callID, inviter) => {
  //         console.log('Incoming call canceled: ', callID, inviter)
  //       },
  //       onOutgoingCallAccepted: (callID, invitee) => {
  //         console.log('Outgoing call accepted: ', callID, invitee)
  //       },
  //       onOutgoingCallRejectedCauseBusy: (callID, invitee) => {
  //         console.log('onOutgoingCallRejectedCauseBusy: ', callID, invitee);
  //       },
  //       onOutgoingCallDeclined: (callID, invitee) => {
  //         console.log('Outgoing call declined: ', callID, invitee)
  //       },
  //       onIncomingCallTimeout: (callID, inviter) => {
  //         console.log('Incoming call timeout: ', callID, inviter)
  //       },
  //       onOutgoingCallTimeout: (callID, invitees) => {
  //         console.log('Outgoing call timeout: ', callID, invitees)
  //       },
  //       ringtoneConfig: {
  //         incomingCallFileName: require('../../../assets/ringtone-205162.mp3'),
  //         outgoingCallFileName: require('../../../assets/happy-pop-1-185286.mp3'),
  //       },
  //       androidNotificationConfig: {
  //         channelID: 'ZegoUIKit',
  //         channelName: 'ZegoUIKit',
  //       },
  //     },
  //   );
  //   return a;
  // }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Tin nhắn"
        component={HomeChat}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#0A68FE" />
          )
        }}
      />
      <Tab.Screen
        name="Danh bạ"
        component={ContactHome}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="contacts" size={24} color="#0A68FE" />
          )
        }}
      />
      <Tab.Screen
        name="Cá nhân"
        component={HomeUser}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="user" size={24} color="#0A68FE" />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default TabHome;
