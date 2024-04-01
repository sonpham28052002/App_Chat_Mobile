import React, { useEffect, useState } from 'react';
import { Button, Dimensions, StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import BarcodeMask from 'react-native-barcode-mask';
import * as LocalAuthentication from 'expo-local-authentication';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';

const finderWidth = 280;
const finderHeight = 230;
const { width, height } = Dimensions.get('window');
const viewMinX = (width - finderWidth) / 2;
const viewMinY = (height - finderHeight) / 2;
const socket = new SockJS('https://deploybackend-production.up.railway.app/ws');
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
  const [firstDataSent, setFirstDataSent] = useState(false); // Thêm biến firstDataSent để kiểm tra xem dữ liệu đã được gửi lần đầu chưa
  const id = useSelector((state) => state.account.id);
  const name = useSelector((state) => state.account.userName);
  const avt = useSelector((state) => state.account.avt);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && scanned) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, scanned]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setCameraVisible(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanLogin(true);
    } else {
      setCanLogin(false);
    }
  }, [timeLeft]);

  const sendUserQR = (data) => {
      console.log("Data");
      console.log(data);
    stompClient.send('/app/QR', {}, JSON.stringify(data));
  };
  const handleBarCodeScanned = async ({ type, data, bounds }) => {
    if (!scanned) {
      setShowConfirmation(true);
      const { origin } = bounds;
      const { x, y } = origin;

      if (
        x >= viewMinX &&
        y >= viewMinY &&
        x <= viewMinX + finderWidth / 2 &&
        y <= viewMinY + finderHeight / 2
      ) {
        setScanned(true);
        let authResult;
          sendUserQR({
            ip: data,
            content: JSON.stringify({
              idUser: undefined,
              avt: avt,
              name: name
            })
          });
          console.log('gửi lần 1 thành công');
          setFirstDataSent(true);
        if (Platform.OS === 'ios') {
          authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Xác thực bằng Face ID hoặc Vân tay để đăng nhập',
          });
        }
        if (Platform.OS === 'android') {
          authResult = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Xác thực bằng vân tay hoặc password để đăng nhập',
          });
        }
        setAuthenticationResult(authResult.success)
        console.log(authResult.success);
        if (authResult.success) {
          // setTimeout(() => {
            await sendUserQR({
              ip: data,
              content: JSON.stringify({
                idUser: id,
                avt: avt,
                name: name
              })
            });
            console.log('gửi lần 2 thành công');
          // }, 10000);
        }
      }
    }
  };

  const handleScanAgain = () => {
    setScanned(false);
    setShowConfirmation(false);
    setTimeLeft(5);
    setCanLogin(false);
    setFirstDataSent(false); // Đặt lại biến firstDataSent khi quét lại
  };
  if (hasPermission === null) {
    return <Text>Yêu cầu quyền camera</Text>;
  }
  if (hasPermission === false) {
    return <Text>Không có quyền</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      {cameraVisible && !showConfirmation && (
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
        <View style={styles.container}>
          <Text style={styles.maintext}>Xác nhận đăng nhập</Text>
          {scanned && timeLeft > 0 && <Text style={styles.timerText}>Thời gian còn lại: {timeLeft} giây</Text>}
          {authenticationResult ? (
            <Button title={'Đăng nhập'} onPress={() => console.log('Đăng nhập thành công')} disabled={!canLogin} />
          ) : (
            <Text style={{ fontSize: 16, marginBottom: 20 }}>Xác thực không thành công.</Text>
          )}
          <Button title={'Quay lại'} onPress={() => (navigation.goBack(), handleScanAgain())} />
        </View>
      )}
      {scanned && timeLeft === 0 && <Button title="Quét lại" onPress={handleScanAgain} />}
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
  }
});
