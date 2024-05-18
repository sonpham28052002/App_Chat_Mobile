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
import { onUserLogin } from '../../../function/zegoCloud/onUserLogin';
// import { ZIMKit } from '@zegocloud/zimkit-rn';
// import * as ZIM from 'zego-zim-react-native';
// import ZegoUIKitPrebuiltCallService from "@zegocloud/zego-uikit-prebuilt-call-rn";

const Tab = createMaterialBottomTabNavigator();

const TabHome = ({ route }) => {
  const dispatch = useDispatch();
  const [userName, setUserName] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && route.params.id) {
          console.log('ID người dùng:', route.params.id);
          // Gọi API để lấy thông tin người dùng nếu có
          const response = await axios.get(`${host}users/getUserById?id=${route.params.id}`);
          setUserName(response.data.userName);
          dispatch(save(response.data)); 
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, [dispatch, route.params]);

  useEffect(() => {
    onUserLogin(route.params.id, userName);
  }, []);

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
