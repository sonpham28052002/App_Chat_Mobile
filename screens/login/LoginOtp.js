import React from "react";
import { SafeAreaView, View, StyleSheet } from 'react-native';
import PhoneInputText from '../../components/PhoneInputText';
import AuthenticateOTP from "../../components/otp/AuthenticateOTP";
const LoginOTP = ({ navigation, route }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <PhoneInputText navigation={navigation} route={route} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginOTP;
