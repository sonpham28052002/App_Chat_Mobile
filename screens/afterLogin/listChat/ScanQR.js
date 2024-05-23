import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Alert, Image } from 'react-native';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import host from '../../../configHost'
import axios from 'axios';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Modal } from 'react-native-paper';
import { Dialog } from '@rneui/themed';

const socket = new SockJS(`${host}ws`);
const stompClient = over(socket);
stompClient.connect(
  {},
  () => {
    console.log("Running");
  },
  (error) => {
    console.error('Error connecting to WebSocket server:', error);
  }
);

export default function ScanQR({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const id = useSelector((state) => state.account.id);
  const name = useSelector((state) => state.account.userName);
  const avt = useSelector((state) => state.account.avt);
  const [data, setData] = useState(undefined);
  const [showDiaLog, setShowDiaLog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && scanned) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, scanned]);

  useEffect(() => {
    if (timeLeft === 0) {
      navigation.goBack();
    }
  }, [timeLeft]);

  const sendUserQR = () => {
      stompClient.send('/app/QR', {}, JSON.stringify({
        ip: data,
        content: JSON.stringify({
          idUser: id,
          avt: avt,
          name: name
        })
      }));
      Alert.alert('Đăng nhập thành công');
      navigation.goBack();
  };

  const handleBarCodeScanned = async (userId) => {
    console.log("Kết bạn với: ", userId);
    try {
      const userRes = await axios.get(`${host}users/getUserById?id=${userId}`);
      if (userRes.data) {
        setShowDiaLog(false);
        navigation.navigate('UserDetailAddFriend', { user: userRes.data });
      } else {
        Alert.alert('Người dùng không tồn tại');
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
    <QRCodeScanner
        onRead={(dataSCan) => {
          if(dataSCan.data.includes('-')){
            setData(dataSCan.data);
            setShowConfirmation(true);
            setScanned(true);
          }else {
            setShowDiaLog(true);
            handleBarCodeScanned(dataSCan.data);
          }
        }}
        // flashMode={RNCamera.Constants.FlashMode.torch}
        topContent={
          <Text>ScanQR Code</Text>
        }
      />
      <Modal visible={showConfirmation} onDismiss={() => setShowConfirmation(false)}
      contentContainerStyle={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: 310,
      }}>
        <Text style={styles.confirmationText}>Đăng nhập tài khoản</Text>
        <Image source={{ uri: avt }} style={{ width: 100, height: 100, borderRadius: 50 }} />
        <Text style={styles.confirmationText}>{name}</Text>
        <TouchableOpacity style={styles.confirmationButton} onPress={sendUserQR}>
          <Text style={styles.confirmationButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <Text style={styles.timerText}>Thời gian còn lại: {timeLeft}s</Text>
      </Modal>
      <Dialog visible={showDiaLog}>
        <Dialog.Loading />
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 30
  },
  timerText: {
    fontSize: 20,
    marginTop: 10,
    color: 'red'
  },
  confirmationText: {
    fontSize: 18,
    marginBottom: 10
  },
  confirmationButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1
  },
  confirmationButtonText: {
    fontSize: 16,
  }
});
