import React from "react";
import { SafeAreaView, View, StyleSheet } from 'react-native';
import PhoneInputText from '../../components/PhoneInputText';
import AuthenticateOTP from "../../components/otp/AuthenticateOTP";
const LoginOTP = ({ navigation, route }) => {
    return (
        <SafeAreaView style={{ flex: 1}}>
            <PhoneInputText screens="TabHome"/>
        </SafeAreaView>
    );
};

export default LoginOTP;
