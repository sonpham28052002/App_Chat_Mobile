import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Contact from '../Contact'
import ContactAction from '../ContactAction'
import User from '../user/User'
import CreateMessager from '../listChat/CreateMessager'
const Stack = createStackNavigator()
const ContactHome = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="Contact" component={Contact} />
          <Stack.Screen name="ContactAction" component={ContactAction} />
        <Stack.Screen name="User" component={User} />
          <Stack.Screen name="CreateMessager" component={CreateMessager} />
    </Stack.Navigator>
  )
}

export default ContactHome