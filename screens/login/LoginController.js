import { createStackNavigator } from "@react-navigation/stack"
import AuthenticateOTP from "../../components/otp/AuthenticateOTP"
import PhoneInputText from '../../components/PhoneInputText'
import Home from '../afterLogin/listChat/HomeChat'
import ListChat from "../afterLogin/listChat/ListChat"
const Stack = createStackNavigator()
const LoginController = () => {
  return (
    <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
    >
       <Stack.Screen name="PhoneInputText" component={PhoneInputText}
      initialParams={ {screens: "TabHome"}} 
      options={{title: 'Số điện thoại'}}
      />
      <Stack.Screen name="AuthenticateOTP" component={AuthenticateOTP}
      options={{title: 'Xác thực OTP'}}
      />
      {/* <Stack.Screen name="Home" component={Home} 
      options={{title: 'Trang chủ chat'}}
      /> */}
    </Stack.Navigator>
  )
}

export default LoginController