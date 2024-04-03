import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import UserProfile from './UserProfile'
import EditProfile from './EditProfile'
import User from './User'
import Login from '../../login/Login'
import ChangePassword from './ChangePassword'
import ButtonEditUserProfile from './ButtonEditUserProfile'
const Stack = createStackNavigator()
const HomeUser = () => {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="UserProfile" component={UserProfile} />
          <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={({ navigation }) => ({
          headerRight: () => <EditProfileHeaderRight navigation={navigation} />,
        })}
      />
        <Stack.Screen name="User" component={User} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ButtonEditUserProfile" component={ButtonEditUserProfile} />
    </Stack.Navigator>
  )
}

export default HomeUser