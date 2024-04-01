import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import PhoneInputText from '../../components/PhoneInputText'
import ResetPass from './ResetPass'
import AuthenticateOTP from '../../components/otp/AuthenticateOTP'

const Stack = createStackNavigator()
const ForgotPasswordStack = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="ForgotPassword" component={PhoneInputText} 
        initialParams={{ screens: 'ResetPass' }}
        options={{ headerShown: false }} />
        <Stack.Screen name='AuthenticateOTP' component={AuthenticateOTP} />
        <Stack.Screen name="ResetPass" component={ResetPass}/>
    </Stack.Navigator>
  )
}

export default ForgotPasswordStack