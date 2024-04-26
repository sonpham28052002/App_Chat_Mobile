import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import ButtonCustom from '../../components/button'
import { Entypo } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import InputPassword from '../../components/InputPassword';
import { checkValidName, checkValidPassword } from '../../function/checkValid';
import { validname, validPassword } from '../../regex/valid';
import host from '../../configHost'

const CreatePassword = ({ navigation, route }) => {

    var [name, setName] = useState('')
    const [checked, setChecked] = useState('Nam');
    var [password, setPassword] = useState('')
    var [rePassword, setRePassword] = useState('')
    var [notification, setNotification] = useState('')

    function checkPassword() {
        if (password != rePassword) {
            setNotification('Mật khẩu không khớp')
            return false
        }
        setNotification('')
        return true;
    }
    function handleRegister() {
        fetch(`${host}account/registerAccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: route.params.id,
                phone: route.params.phone,
                password: password,
                createDate: new Date().toISOString(),
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                handleInsertUser(data)
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    function handleInsertUser(data) {
        fetch(`${host}users/insertUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: data.id,
                userName: name,
                phone: data.phone,
                gender: checked,
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }

    return (
        <LinearGradient style={{ flex: 1, padding: 10 }}
            colors={['#7cc0d8', '#FED9B7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: '10%' }}>
                <Text style={{ width: '100%', fontSize: 30, fontWeight: 700, textAlign: 'center' }}>Nhập thông tin để hoàn tất đăng ký</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
                <View style={{ height: 230, justifyContent: 'space-between', marginBottom: 20 }}>
                    <TextInput style={{
                        padding: 10,
                        height: 40,
                        fontSize: 20,
                        borderColor: 'black',
                        borderWidth: 2,
                        borderRadius: 5
                    }}
                        value={name}
                        onChangeText={setName}
                        placeholder={'Nhập tên tài khoản'}
                        placeholderTextColor={'gray'}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.text}>Giới tính:</Text>
                        <RadioButton
                            value="Nam"
                            status={checked === 'Nam' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('Nam')}
                        />
                        <Text style={styles.text}>Nam</Text>
                        <RadioButton
                            value="Nữ"
                            status={checked === 'Nữ' ? 'checked' : 'unchecked'}
                            onPress={() => setChecked('Nữ')}
                        />
                        <Text style={styles.text}>Nữ</Text>
                    </View>
                    <InputPassword setPassword={setPassword} placeholder="Nhập mật khẩu"/>
                    <InputPassword setPassword={setRePassword} placeholder="Nhập lại mật khẩu"/>
                </View>
                <ButtonCustom title={'Đăng ký'} backgroundColor={'cyan'} onPress={
                    () => {
                        if (!checkValidName(name, validname)) {
                            setNotification('Tên không hợp lệ')
                        } else if(!checkValidPassword(password, validPassword)) {
                            setNotification('Mật khẩu phải độ dài từ 8 ký tự trở lên và chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số')
                        } else if (checkPassword() && password != '') {
                            handleRegister()
                            Alert.alert('Đăng ký thành công. Hãy tiến hành đăng nhập!')
                            navigation.navigate('Login', {
                                id: route.params.id,
                                phone: route.params.phone,
                                password: password
                            })
                        }
                    }
                } />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>{notification}</Text>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    }
})

export default CreatePassword