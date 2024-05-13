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
// import { ZIMKit } from '@zegocloud/zimkit-rn';
// import * as ZIM from 'zego-zim-react-native';
// import ZegoUIKitPrebuiltCallService from "@zegocloud/zego-uikit-prebuilt-call-rn";

const Tab = createMaterialBottomTabNavigator();

const TabHome = ({ route }) => {
  const dispatch = useDispatch();

  // const appConfig = {
  //   appID: 1532398834, // The AppID you get from ZEGOCLOUD Admin Console.
  //   appSign: 'df5e8d723e44364f8e74237831ca7159', // The AppSign you get from ZEGOCLOUD Admin Console.
  // };
  // useEffect(() => {
  //   ZIMKit.init(appConfig.appID, appConfig.appSign);
  //   ZIMKit.connectUser({
  //     userID: '123', // Your ID as a user.  
  //     userName: 'Ss' // Your name as a user.
  //   }, '')
  //     .then(() => {
  //       // Implement your event handling logic after logging in successfully. 

  //       // initialized ZegoUIKitPrebuiltCallInvitationService.
  //       // when app's user is logged in or re-logged in.
  //       // We recommend calling this method as soon as the user logs in to your app.
  //       ZegoUIKitPrebuiltCallService.init(
  //         appConfig.appID, // The AppID you get from ZEGOCLOUD Admin Console.
  //         appConfig.appSign, // The AppSign you get from ZEGOCLOUD Admin Console.
  //         '123', // Your ID as a user.  
  //         'Ss', // Your name as a user.
  //         [ZIM],
  //       );
  //     });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && route.params.id) {
          // Gọi API để lấy thông tin người dùng nếu có
          const response = await axios.get(`${host}users/getUserById?id=${route.params.id}`);
          dispatch(save(response.data)); 
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, [dispatch, route.params]);


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
