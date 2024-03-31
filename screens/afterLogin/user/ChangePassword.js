import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import InputPassword from '../../../components/InputPassword'
import ButtonCustom from '../../../components/button'
import axios from 'axios'
import { useSelector } from 'react-redux'

const ChangePassword = () => {
  const phone = useSelector((state) => state.account.phone)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [notification, setNotification] = useState('')

  function checkPassword({navigation}) {
    if (newPassword != rePassword) {
      setNotification('Mật khẩu không khớp')
      return false
    }
    changePassword()
    return true;
  }

  const changePassword = async () => {
    try {
      const res = await axios.put(`https://deploybackend-production.up.railway.app/account/updatePasswordAccount?phone=${phone}&passwordOld=${oldPassword}&passwordNew=${newPassword}`);
      if (res.data) {
        setNotification('')
        Alert.alert("Đổi mật khẩu thành công!")
        navigation.navigate('UserProfile')
      }else{
        setNotification('Mật khẩu cũ không đúng')
      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: '100%', height: 300, justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <InputPassword setPassword={setOldPassword} placeholder='Nhập mật khẩu cũ' />
        <InputPassword setPassword={setNewPassword} placeholder='Nhập mật khẩu mới' />
        <InputPassword setPassword={setRePassword} placeholder='Nhập lại mật khẩu mới' />
        <ButtonCustom title="Đổi mật khẩu" onPress={checkPassword} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>{notification}</Text>
      </View>
    </View>
  )
}

export default ChangePassword