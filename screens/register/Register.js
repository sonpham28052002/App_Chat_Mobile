import { createStackNavigator } from "@react-navigation/stack"
import AuthenticateOTP from "../../components/otp/AuthenticateOTP"
import CreatePassword from "./CreatePassword"
import PhoneInputText from "../../components/PhoneInputText"

const Stack = createStackNavigator()
const Register = () => {
  return (
    <Stack.Navigator
    >
      <Stack.Screen name="PhoneInputText" component={PhoneInputText}
      initialParams={ {screens: "CreatePassword"}} // màn hình tiếp theo sau khi xác thực thành công
      options={{title: 'Số điện thoại'}}
      />
      <Stack.Screen name="AuthenticateOTP" component={AuthenticateOTP}
      options={{title: 'Xác thực OTP'}}
      />
      <Stack.Screen name="CreatePassword" component={CreatePassword} 
      options={{title: 'Tạo thông tin người dùng'}}
      />
    </Stack.Navigator>
  )
}

export default Register