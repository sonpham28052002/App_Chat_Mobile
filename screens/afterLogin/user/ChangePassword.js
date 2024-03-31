import { View, Text } from 'react-native'
import React, { useState } from 'react'
import InputPassword from '../../../components/InputPassword'

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
  return (
    <View>
      <Text>ChangePassword</Text>
    </View>
  )
}

export default ChangePassword