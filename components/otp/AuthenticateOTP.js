import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import { OtpInput } from "react-native-otp-entry";
import ButtonCustom from '../button'
import auth from '@react-native-firebase/auth';
// import { confirmCode } from '../../function/confirmCodeOTP';
import { LinearGradient } from 'expo-linear-gradient';

const AuthenticateOTP = ({ navigation, route }) => {

    const [code, setCode] = React.useState('')
    const [err, setErr] = React.useState(null)

    async function confirmCode() {
        const credential = auth.PhoneAuthProvider.credential(route.params.verificationId, code);
        auth().signInWithCredential(credential)
            .then((response) => {
                navigation.navigate(route.params.screen, { id: response.user.uid, phone: route.params.phone })
            })
            .catch((error) => {
                console.log(error)
                setErr('Mã OTP không đúng!')
            });
        ;
    }

    return (
        <LinearGradient style={{ flex: 1, width: '100%', paddingHorizontal: '5%', justifyContent: 'center' }}
            colors={['#7cc0d8', '#FED9B7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={{ flex: 1, marginVertical: 20, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Image source={require('../../assets/bgr.png')} style={{ width: 200, height: 200 }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={styles.text}>Mã OTP đã được gửi đến số điện thoại: {route.params.phone}</Text>
            </View>
            <View style={{ flex: 5 }}>
                <View style={{ width: '100%' }}>
                    <Text style={styles.text}>Nhập mã OTP trên điện thoại:</Text>
                    <OtpInput numberOfDigits={6}
                        theme={{
                            containerStyle: {
                                marginVertical: 10
                            },
                            pinCodeContainerStyle: {
                                borderWidth: 1,
                                borderColor: 'black',
                            }
                        }}
                        onTextChange={(text) => setCode(text)} />
                </View>
                <ButtonCustom title={'Xác thực'} backgroundColor={'cyan'} onPress={confirmCode} />
                <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>{err}</Text>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: 'bold'
    },
})

export default AuthenticateOTP