import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ListChat from './ListChat';
import Chat from './Chat';
import OptionChat from './OptionChat';
import ScanQR from './ScanQR';
import TabHome from '../tabHome/TabHome';


const Stack = createStackNavigator();

const HomChat = ({ navigation, route }) => {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="TabHome" component={TabHome} options={{ headerShown: false }} /> */}
      <Stack.Screen name="ListChat" initialParams={navigation} component={ListChat}
      options={{
        headerShown:false
      }}
       />
      <Stack.Screen
        name="Chat"
        component={Chat}
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

export default HomChat;
