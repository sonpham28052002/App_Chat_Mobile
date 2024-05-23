import { View, Image } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import ButtonCustom from './button'
// // import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// // import { firebaseConfig } from '../config'
// import { sendVerification } from '../function/sendVerification';
import PhoneInput from "react-native-phone-input";
import auth from '@react-native-firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';

const PhoneInputText = ({ navigation, route }) => {

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');

  const phoneInput = useRef(null);
  const [phone, setPhone] = useState('');

  // const recaptchaVerifier = useRef(null);
  // const [verificationId, setVerificationId] = useState(null);

  // Handle login
  function onAuthStateChanged(user) {
    if (user) {
      // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
      // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
      // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
      // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the button press
  async function signInWithPhoneNumber() {
    const confirmation = await auth().verifyPhoneNumber(phone);
    navigation.navigate('AuthenticateOTP', {
      phone: phone,
      verificationId: confirmation.verificationId,
      screen: route.params.screens
    })
  }

  return (
    <LinearGradient style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: '5%' }}
      colors={['#7cc0d8', '#FED9B7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Image source={require('../assets/bgr.png')} style={{ width: 200, height: 200 }} />
      </View>
      <View style={{ flex: 2 }}>
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
        <View style={{ marginVertical: 10 }}>
          <ButtonCustom title={'Gửi mã OTP'} backgroundColor={'cyan'}
            onPress={() => {
              signInWithPhoneNumber()
              // sendVerification(phone, recaptchaVerifier, (data) => { setVerificationId(data) })
            }}
          />
        </View>
        {/* {
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
      } */}
      </View>
    </LinearGradient>
  )
}
export default PhoneInputText