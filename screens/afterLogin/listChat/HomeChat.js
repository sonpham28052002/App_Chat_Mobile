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
  return (
    <Stack.Navigator>
        {/* <Stack.Screen name="TabHome" component={TabHome}
        options={{
          headerShown: false
        }}
        ></Stack.Screen> */}
        <Stack.Screen name="ListChat" component={ListChat} 
        options={{
          headerShown: false
        }}
        />
        
      <Stack.Screen name="ScanQR" component={ScanQR} options={{ headerShown: false }} />
      {/* <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="UserProfile" component={UserProfile} /> */}
    </Stack.Navigator>
  );
};

export default HomeChat;
