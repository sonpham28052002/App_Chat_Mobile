import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListChat from './ListChat';
import Chat from './Chat';
import OptionChat from './OptionChat';
import ScanQR from './ScanQR';
import TabHome from '../tabHome/TabHome';
import { useDispatch } from 'react-redux';

const Stack = createStackNavigator();


const HomeChat = ({ navigation, route }) => {
  // const dispatch = useDispatch();
  
  // useEffect(() => {
  //   if (route.params && route.params.id) { // Kiểm tra xem route.params và route.params.id có tồn tại không
  //     const fetchData = async () => {
  //       try {
  //         const response = await axios.get(`https://deploybackend-production.up.railway.app/users/getUserById?id=${route.params.id}`);
  //         dispatch(save(response.data));
  //         console.log(response.data);
  //       } catch (error) {
  //         console.error('Lỗi khi gọi API:', error);
  //       }
  //     };

  //     fetchData();
  //   }
  // }, [dispatch, route.params]);
  return (
    <Stack.Navigator>
        {/* <Stack.Screen name="TabHome" component={TabHome}
        options={{
          headerShown: false
        }}
        ></Stack.Screen> */}
        <Stack.Screen name="ListChat" initialParams={navigation} component={ListChat} 
        options={{
          headerShown: false
        }}
        />
        <Stack.Screen name="Chat" component={Chat} 
        options={{
          headerStyle: {
            backgroundColor: 'lightblue',
          },
          headerTitleStyle: {
            fontSize: 20,
          },
          headerShown:false
        }}
      />
      <Stack.Screen name="OptionChat" component={OptionChat} />
      <Stack.Screen name="ScanQR" component={ScanQR} options={{ headerShown: false }} />
      {/* <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="UserProfile" component={UserProfile} /> */}
    </Stack.Navigator>
  );
};

export default HomeChat;
