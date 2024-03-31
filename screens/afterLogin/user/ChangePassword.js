import { View, Text, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import InputPassword from '../../../components/InputPassword'
import ButtonCustom from '../../../components/button'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'

const ChangePassword = ({ navigation }) => {
  const phone = useSelector((state) => state.account.phone)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [rePassword, setRePassword] = useState('')
  const [notification, setNotification] = useState('')

  function checkPassword() {
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
        Alert.alert("Đổi mật khẩu thành công!")
        navigation.navigate('UserProfile')
      } else {
        setNotification('Mật khẩu cũ không đúng')
      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <LinearGradient style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
      colors={['#7cc0d8', '#FED9B7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{flex: 0.8, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={{ uri: 'https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png'}}
            style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 3 }}
          />
      </View>
      <View style={{ flex: 1, width: '100%', height: 300, justifyContent: 'space-between', paddingHorizontal: 10 }}>
        <InputPassword setPassword={setOldPassword} placeholder='Nhập mật khẩu cũ' />
        <InputPassword setPassword={setNewPassword} placeholder='Nhập mật khẩu mới' />
        <InputPassword setPassword={setRePassword} placeholder='Nhập lại mật khẩu mới' />
        <ButtonCustom title="Đổi mật khẩu" backgroundColor={'cyan'} onPress={checkPassword} />
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>{notification}</Text>
      </View>
    </LinearGradient>
  )
}

export default ChangePassword