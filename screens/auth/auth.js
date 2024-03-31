import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from '../login/Login'
// import Register from '../screens/register/Register';
import Register from '../register/Register'
import ForgotPassword from '../forgotPassword/ForgotPassword';
import HomeChat from '../afterLogin/listChat/HomeChat';
import CreatePassword from '../register/CreatePassword';
import User  from '../afterLogin/user/User';

import AuthenOtp from '../forgotPassword/AuthenOtp.js'
import ResetPass from '../forgotPassword/ResetPass.js'
const Stack = createStackNavigator()

export default function Auth() {
    return (
        <NavigationContainer>
        <Stack.Navigator
        screenOptions={{
          headerShown: true
        }}
        >
          <Stack.Screen name="Login" component={Login}
          options={{
            headerShown: false
          }}
          />
          <Stack.Screen name="Register" 
          options={{
            headerShown: false
          }}
          component={Register} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="AuthenOtp" component={AuthenOtp} />
          <Stack.Screen name="ResetPass" component={ResetPass} />
          <Stack.Screen name="Home" component={HomeChat} 
          options={{
            headerShown: false
          }}
          />
          <Stack.Screen name="CreatePassword" component={CreatePassword} />
          <Stack.Screen name="User" component={User} />
        </Stack.Navigator>
        </NavigationContainer>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });