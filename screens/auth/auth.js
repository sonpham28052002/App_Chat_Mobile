import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../login/Login'
import Register from '../register/Register'
import LoginOtp from '../login/LoginOtp.js';
import ResetPass from '../forgotPassword/ResetPass.js'
import TabHome from '../afterLogin/tabHome/TabHome.js';
import UserProfile from '../afterLogin/user/UserProfile.js';
import ForgotPasswordStack from '../forgotPassword/ForgotPasswordStack.js';
import ListChat from '../afterLogin/listChat/ListChat.js';
import Chat from '../afterLogin/listChat/Chat.js';
import PhoneInputText from '../../components/PhoneInputText.js';
import AuthenticateOTP from '../../components/otp/AuthenticateOTP.js';
import OptionChat from '../afterLogin/listChat/OptionChat.js';
import OptionChat2 from '../afterLogin/listChat/OptionChat2.js';
import Search from '../afterLogin/Search/Search.js'
import ListMemberGroup from '../afterLogin/listChat/ListMemberGroup.js'
import { ZegoCallInvitationDialog } from '@zegocloud/zego-uikit-prebuilt-call-rn'
import {
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Stack = createStackNavigator()
export default function Auth() {
  return (
    <NavigationContainer>
      <ZegoCallInvitationDialog />
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="LoginOtp" component={LoginOtp} options={{ headerShown: false }} />
        {/* <Stack.Screen name="LoginController" component={LoginController}
          options={{
            headerShown: false
          }}
        /> */}
        <Stack.Screen name="PhoneInputText" component={PhoneInputText} options={{ headerShown: false }} />
        <Stack.Screen name="AuthenticateOTP" component={AuthenticateOTP} options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordStack} />
        <Stack.Screen name="ResetPass" component={ResetPass} />
        <Stack.Screen name="TabHome" component={TabHome} options={{ headerShown: false }} />
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
        <Stack.Screen
          options={{ headerShown: false }}
          // DO NOT change the name 
          name="ZegoUIKitPrebuiltCallWaitingScreen"
          component={ZegoUIKitPrebuiltCallWaitingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          // DO NOT change the name
          name="ZegoUIKitPrebuiltCallInCallScreen"
          component={ZegoUIKitPrebuiltCallInCallScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}