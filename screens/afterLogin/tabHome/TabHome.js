import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeChat from '../listChat/HomeChat';
import Contact from '../Contact';
import HomeUser from '../user/HomeUser';
import ContactHome from '../user/ContactHome'
import { save } from '../../../Redux/slice';
import axios from 'axios';

const Tab = createMaterialBottomTabNavigator();

const TabHome = ({ route }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && route.params.id) {
          // Gọi API để lấy thông tin người dùng nếu có
          const response = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${route.params.id}`);
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
