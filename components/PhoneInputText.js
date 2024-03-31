import { View, Image } from 'react-native'
import React, { useRef, useState } from 'react'
import ButtonCustom from './button'
import { RadioButton } from 'react-native-paper';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { firebaseConfig } from '../config'
import { sendVerification } from '../function/sendVerification';
import PhoneInput from "react-native-phone-input";
import AuthenticateOTP from './otp/AuthenticateOTP';
import { LinearGradient } from 'expo-linear-gradient';

const PhoneInputText = ({navigation, route}) => {

  const phoneInput = useRef(null);
  const [phone, setPhone] = useState('');

  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState(null);

  return (
    <LinearGradient style={{ flex: 1, justifyContent: 'center', paddingHorizontal: '5%' }}
      colors={['#7cc0d8', '#FED9B7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Image source={require('../assets/bgr.png')} style={{width: 200, height: 200}}/>
      </View>
      <View style={{flex: 2}}>
      <PhoneInput ref={phoneInput}
        initialCountry='vn'
        onChangePhoneNumber={setPhone}
        style={{
          backgroundColor: 'white',
          paddingLeft: 10,
          width: '100%',
          height: 50,
          borderColor: 'black',
          borderWidth: 1,
          borderRadius: 5,
          marginVertical: 10
        }}
        textStyle={{
          paddingHorizontal: 10,
          fontSize: 20,
          height: 50,
          borderLeftWidth: 1,
        }}
        cancelText='Hủy'
        cancelTextStyle={{ fontSize: 20, color: 'red' }}
        confirmText='Xác nhận'
        confirmTextStyle={{ fontSize: 20, color: 'green' }}
        pickerItemStyle={{ fontSize: 20 }}
      />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View style={{marginVertical: 10}}>
      <ButtonCustom title={'Gửi mã OTP'} backgroundColor={'cyan'}
        onPress={() => {
          sendVerification(phone, recaptchaVerifier, (data) => { setVerificationId(data) })
        }}
      />
      </View>
      {
        verificationId && <ButtonCustom title={'Xác thực OTP'} backgroundColor={'cyan'}
          onPress={()=>{
            console.log(route.params.screens);
            navigation.navigate('AuthenticateOTP', { 
              phone: phone,
              verificationId: verificationId,
              callBack: (uid) => { //hàm thực thi sau khi xác thực thành công
                navigation.navigate(route.params.screens, { //chuyển đến màn hình tiếp theo
                  id: uid,
                  phone: phone.slice(1),
                })
              }
            })
          }}
        />
      }
      </View>
    </LinearGradient>
  )
}
export default PhoneInputText