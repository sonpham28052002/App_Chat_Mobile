import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import UserProfile from './UserProfile'
import EditProfile from './EditProfile'
import User from './User'
import ChangePassword from './ChangePassword'

const Stack = createStackNavigator()
const HomeUser = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} 
        options={{
          headerShown: true
        }}
        />
    </Stack.Navigator>
  )
}

export default HomeUser