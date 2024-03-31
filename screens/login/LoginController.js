import { createStackNavigator } from "@react-navigation/stack"
import Login from "./Login"
import AuthenticateOTP from "../../components/otp/AuthenticateOTP"
import LoginOtp from './LoginOtp'
import PhoneInputText from '../../components/PhoneInputText'
import Home from '../afterLogin/listChat/HomeChat'
import TabHome from "../afterLogin/tabHome/TabHome"
const Stack = createStackNavigator()
const LoginController = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
    >
      <Stack.Screen name="PhoneInputText" component={PhoneInputText}
      initialParams={ {screens: "Home"}} 
      options={{title: 'Số điện thoại'}}
      />
      <Stack.Screen name="AuthenticateOTP" component={AuthenticateOTP}
      options={{title: 'Xác thực OTP'}}
      />
      <Stack.Screen name="Home" component={TabHome} 
      options={{title: 'Trang chủ chat'}}
      />
    </Stack.Navigator>
  )
}

export default LoginController