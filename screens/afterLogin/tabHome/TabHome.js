import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import User from '../user/User'
import Contact from '../Contact'
import ListChat from '../listChat/ListChat'
import HomeChat from '../listChat/HomeChat'
import UserProfile from '../user/UserProfile'
import HomeUser from '../user/HomeUser'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { save } from '../../../Redux/slice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createMaterialBottomTabNavigator()

const TabHome = ({ route }) => {
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && route.params.id) {
          const response = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${route.params.id}`);
          dispatch(save(response.data)); 
          console.log(response.data);
        }
      } catch (error) {
        console.error('Lỗi khi gọi API:', error);
      }
    };

    fetchData();
  }, [dispatch, route.params]);

 useEffect(() => {
    const fetchAccount = async () => {
      try {
        // const account = await AsyncStorage.getItem('account');
        console.log("account",account);
        dispatch(save(account)); 
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      }
    };
    fetchAccount();
  }, [dispatch]);

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
        component={Contact}
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
  )
}

export default TabHome
