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
import User from '../afterLogin/user/User';
import LoginOtp from '../login/LoginOtp.js';
import AuthenOtp from '../forgotPassword/AuthenOtp.js'
import ResetPass from '../forgotPassword/ResetPass.js'
import LoginController from '../login/LoginController.js';
import TabHome from '../afterLogin/tabHome/TabHome.js';
import HomChat from '../afterLogin/listChat/HomeChat';
import UserProfile from '../afterLogin/user/UserProfile.js';
import ForgotPasswordStack from '../forgotPassword/ForgotPasswordStack.js';
import ListChat from '../afterLogin/listChat/ListChat.js';
import Chat from '../afterLogin/listChat/Chat.js';
import OptionChat from '../afterLogin/listChat/OptionChat.js';
import OptionChat2 from '../afterLogin/listChat/OptionChat2.js';
import Search from '../afterLogin/Search/Search.js'
import ListMemberGroup from '../afterLogin/listChat/ListMemberGroup.js'
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
        <Stack.Screen name="LoginOtp" component={LoginOtp}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="LoginController" component={LoginController}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="Register"
          options={{
            headerShown: false
          }}

          component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordStack} />
        <Stack.Screen name="AuthenOtp" component={AuthenOtp} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
        {/* <Stack.Screen name="Home" component={HomChat} /> */}
        <Stack.Screen name="TabHome" component={TabHome}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="ListChat" component={ListChat} />
        <Stack.Screen name="Chat" component={Chat}
          options={{
            headerStyle: {
              backgroundColor: 'cyan',
            },
            headerTitleStyle: {
              fontSize: 20,
            }
            // headerShown:false
          }}
        />
        <Stack.Screen name="OptionChat" component={OptionChat} />
        <Stack.Screen
          name="OptionChat2"
          component={OptionChat2}
          options={{
            headerShown: true,
            title: "Ảnh,file,link đã gửi",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="ListMemberGroup"
          component={ListMemberGroup}
          options={{
            headerShown: true,
            title: "Thành viên",
            headerStyle: {
              backgroundColor: "#00aaff",
            },
            headerTintColor: "white",
          }}
        />
        <Stack.Screen name="Search" component={Search}
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