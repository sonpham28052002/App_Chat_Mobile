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
import LoginOtp from '../login/LoginOtp.js';
import AuthenOtp from '../forgotPassword/AuthenOtp.js'
import ResetPass from '../forgotPassword/ResetPass.js'
import LoginController from '../login/LoginController.js';
import TabHome from '../afterLogin/tabHome/TabHome.js';
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
            headerShown: false}}
          />
          <Stack.Screen name="LoginOtp" component={LoginOtp}
           options={{
            headerShown: false}}
          />
          <Stack.Screen name="LoginController" component={LoginController}
           options={{
            headerShown: false}}
          />
          <Stack.Screen name="Register" 
          options={{
            headerShown: false
          }}
          component={Register} />
          <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: true,
            title: "Lấy lại mật khẩu",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
         <Stack.Screen
          name="AuthenOtp"
          component={AuthenOtp}
          options={{
            headerShown: true,
            title: "Nhập mã xác thực",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
         <Stack.Screen
          name="ResetPass"
          component={ResetPass}
          options={{
            headerShown: true,
            title: "Tạo mật khẩu mới",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
          }}
        />
          <Stack.Screen name="Home" component={TabHome} 
          options={{
            headerShown: false
          }}
          />
          {/* <Stack.Screen name="CreatePassword" component={CreatePassword} /> */}
          {/* <Stack.Screen name="User" component={User} /> */}
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