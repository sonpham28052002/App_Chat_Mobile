import React, { useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, TouchableOpacity, Text, View, Platform, Alert } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import host from '../../../configHost'
import axios from 'axios';

const finderWidth = 280;
const finderHeight = 230;
const { width, height } = Dimensions.get('window');
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
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
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [authenticationResult, setAuthenticationResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [canLogin, setCanLogin] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [firstDataSent, setFirstDataSent] = useState(false); 
  const [sendSecondTime, setSendSecondTime] = useState(false);
  const [idForSecondSend, setIdForSecondSend] = useState(undefined);
  const id = useSelector((state) => state.account.id);
  const name = useSelector((state) => state.account.userName);
  const avt = useSelector((state) => state.account.avt);
  const [userScan, setUserScan] = useState(false);
  const [needPassword, setNeedPassword] = useState(true); // Cần xác thực mật khẩu mặc định

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && scanned) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, scanned]);

  useEffect(() => {
    // (async () => {
    //   const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   setHasPermission(status === 'granted');
    //   if (status === 'granted' && !userScan) { 
    //     setCameraVisible(true);
    //   }
    // })();
  }, [userScan]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanLogin(true);
    } else {
      setCanLogin(false);
    }
  }, [timeLeft]);

  const sendUserQR = (data, idUser) => {
    console.log("Data");
    console.log(data);
    stompClient.send('/app/QR', {}, JSON.stringify(data));
    if (idUser !== undefined) {
      stompClient.send('/app/QR', {}, JSON.stringify({
        ip: data,
        content: JSON.stringify({
          idUser: idUser,
          avt: avt,
          name: name
        })
      }));
    }
  };

  const handleBarCodeScanned = async ({ type, data, bounds }) => {
    if (!scanned) {
      const { origin } = bounds;
      const { x, y } = origin;

      if (
        x >= viewMinX &&
        y >= viewMinY &&
        x <= viewMinX + finderWidth / 2 &&
        y <= viewMinY + finderHeight / 2
      ) {
        setScanned(true);
        setUserScan(true);
        let authResult;
        try {
          const userRes = await axios.get(`${host}users/getUserById?id=${data}`);
          if (userRes.data) {
            navigation.navigate('UserDetailAddFriend', { user: userRes.data });
            setUserScan(false)
            sendUserQR(data, undefined);
          } else {
            Alert.alert('Người dùng không tồn tại');
          }
        } catch (error) {
        }
        console.log('gửi lần 1 thành công');
        setFirstDataSent(true);
      }
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setShowConfirmation(false);
    setTimeLeft(5);
    setCanLogin(false);
    setFirstDataSent(false);
    setUserScan(false);
  };

  const handleLogin = async () => {
    setShowConfirmation(false);
    setTimeLeft(5);
    setSendSecondTime(true);
    if (await LocalAuthentication.hasHardwareAsync()) {
      let compatibleBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (compatibleBiometrics.includes(3)) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Xác thực người dùng"
        });
        if (result.success) {
          setNeedPassword(false);
          sendUserQR(idForSecondSend, id);
          setIdForSecondSend(undefined);
        }
      }
    }
  };

  useEffect(() => {
    if (sendSecondTime) {
      setTimeout(() => {
        setSendSecondTime(false);
      }, 10000);
    }
  }, [sendSecondTime]);

  if (hasPermission === null) {
    return <Text>Yêu cầu quyền camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Không có quyền</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* {cameraVisible && !userScan && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
          style={[StyleSheet.absoluteFillObject, styles.container]}
        >
          <View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end' }}
              onPress={() => navigation.goBack()}
            >
              <Text style={{ fontSize: 18, margin: 5, color: 'white' }}>Back</Text>
            </TouchableOpacity>
          </View>
          <BarcodeMask edgeColor="#62B1F6" showAnimatedLine />
        </BarCodeScanner>
      )}
      {showConfirmation && (
        <View style={styles.confirmationContainer}>
          <Text style={styles.confirmationText}>Xác thực người dùng</Text>
          <TouchableOpacity style={styles.confirmationButton} onPress={handleLogin} disabled={!canLogin}>
            <Text style={styles.confirmationButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <Text style={styles.timerText}>Thời gian còn lại: {timeLeft}s</Text>
        </View>
      )} */}
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
    marginTop: 10
  },
  confirmationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#62B1F6',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center'
  },
  confirmationText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10
  },
  confirmationButton: {
    backgroundColor: '#62B1F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  confirmationButtonText: {
    color: 'white',
    fontSize: 16
  }
});
