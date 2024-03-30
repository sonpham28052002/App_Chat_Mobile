import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import ButtonCustom from '../../components/button'
import { Entypo } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';

const CreatePassword = ({ navigation, route }) => {
    var [eye1, setEye1] = useState('eye-with-line')
    var [eye2, setEye2] = useState('eye-with-line')
    var [secureTextEntry1, setSecureTextEntry1] = useState(true)
    var [secureTextEntry2, setSecureTextEntry2] = useState(true)

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
        fetch('https://deploybackend-production.up.railway.app/account/registerAccount', {
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
        fetch('https://deploybackend-production.up.railway.app/users/insertUser', {
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
        <View style={{ flex: 1, backgroundColor: 'lightblue', padding: 10}}>
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
                        borderWidth: 1,
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
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '88%' }}>
                            <TextInput style={{
                                padding: 10,
                                height: 40,
                                fontSize: 20,
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 5
                            }}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={secureTextEntry1}
                                placeholder='Nhập mật khẩu'
                                placeholderTextColor={'gray'}
                            />
                        </View>
                        <View style={{ width: '12%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                if (eye1 == 'eye') {
                                    setEye1('eye-with-line')
                                    setSecureTextEntry1(!secureTextEntry1)
                                }
                                else {
                                    setEye1('eye')
                                    setSecureTextEntry1(!secureTextEntry1)
                                }
                            }}>
                                <Entypo name={eye1} size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%' }}>
                        <View style={{ width: '88%' }}>
                            <TextInput style={{
                                padding: 10,
                                height: 40,
                                fontSize: 20,
                                borderColor: 'black',
                                borderWidth: 1,
                                borderRadius: 5
                            }}
                                value={rePassword}
                                onChangeText={setRePassword}
                                secureTextEntry={secureTextEntry2}
                                placeholder='Nhập lại mật khẩu'
                                placeholderTextColor={'gray'}
                            />
                        </View>
                        <View style={{ width: '12%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => {
                                if (eye2 == 'eye') {
                                    setEye2('eye-with-line')
                                    setSecureTextEntry2(!secureTextEntry2)
                                }
                                else {
                                    setEye2('eye')
                                    setSecureTextEntry2(!secureTextEntry1)
                                }
                            }}>
                                <Entypo name={eye2} size={30} color="black" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <ButtonCustom title={'Đăng ký'} backgroundColor={'cyan'} onPress={
                    () => {
                        if (checkPassword() && password != '') {
                            handleRegister()
                            navigation.navigate('Login')
                        }
                    }
                } />
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red' }}>{notification}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
})

export default CreatePassword