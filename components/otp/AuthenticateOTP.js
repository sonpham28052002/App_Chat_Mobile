import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { OtpInput } from "react-native-otp-entry";
import ButtonCustom from '../button'
import { confirmCode } from '../../function/confirmCodeOTP';
import { LinearGradient } from 'expo-linear-gradient';

const AuthenticateOTP = ({ route }) => {

    const [code, setCode] = React.useState('')
    const [err, setErr] = React.useState(null)

    return (
        <LinearGradient style={{ flex: 1, width: '100%', paddingHorizontal: 10, justifyContent: 'center' }}
            colors={['#7cc0d8', '#FED9B7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
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
                <ButtonCustom title={'Xác thực'} backgroundColor={'cyan'} onPress={
                    () => {
                        confirmCode(route.params.verificationId, code,
                            (uid) => { // hàm thực thi sau khi xác thực thành công
                                setCode('');
                                route.params.callBack(uid)
                            },
                            () => { setErr('Mã OTP không đúng!') }) // hàm thực thi sau khi xác thực thất bại
                    }
                } />
                <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>{err}</Text>
                {/* <View style={{flexDirection: 'row', marginTop:20}}>
                    <Text style={styles.text}>Bạn không nhận được mã? </Text>
                    <TouchableOpacity style={{
                        fontSize: 20, color: 'blue', justifyContent: 'flex-end', alignItems: 'center'
                    }}><Text>Gửi lại</Text></TouchableOpacity>
                </View> */}
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