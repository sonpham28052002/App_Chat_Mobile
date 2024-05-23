import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListChat from './ListChat';
import ScanQR from './ScanQR';
import CreateMessager from '../listChat/CreateMessager'
import UserDetailAddFriend from '../user/UserDetailAddFriend';
import UserOptionsScreen from '../user/UserOptionScreen';
const Stack = createStackNavigator();


const HomeChat = ({route}) => {
  return (
    <Stack.Navigator>
        <Stack.Screen name="ListChat" component={ListChat} 
        initialParams={{ id: route.params.id }}
        options={{
          headerShown: false
        }}
        />
          <Stack.Screen name="CreateMessager" component={CreateMessager} 
        options={{
          headerShown: false
        }}
        />
      <Stack.Screen name="ScanQR" component={ScanQR} options={{ headerShown: false }} />
    <Stack.Screen name="UserDetailAddFriend" component={UserDetailAddFriend} options={{ headerShown: false }} />
   <Stack.Screen name="UserOptionsScreen" component={UserOptionsScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default HomeChat;
